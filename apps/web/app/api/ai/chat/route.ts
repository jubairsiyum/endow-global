import { StreamingTextResponse, LangChainStream } from 'ai'
import { ChatOpenAI } from '@langchain/openai'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { getVectorStore, CHATBOT_SYSTEM_PROMPT } from '@/lib/openai'
import { auth } from '@/lib/auth'
import { rateLimit } from '@/lib/redis'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const session = await auth()
  const userId = session?.user?.id || 'anonymous'

  const allowed = await rateLimit(`chat:${userId}`, 20, 60)
  if (!allowed) {
    return new Response('Rate limit exceeded', { status: 429 })
  }

  const { messages, sessionId } = await req.json()
  const lastMessage = messages[messages.length - 1]?.content

  const { stream, handlers } = LangChainStream()
  const vectorStore = await getVectorStore()
  const retriever = vectorStore.asRetriever(5)

  const model = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.3,
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY!,
  })

  const chain = ConversationalRetrievalQAChain.fromLLM(model, retriever, {
    returnSourceDocuments: false,
    qaChainOptions: {
      type: 'stuff',
      prompt: undefined,
    },
  })

  chain.call({
    question: lastMessage,
    chat_history: messages.slice(0, -1).map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join('\n'),
  }, [handlers]).catch(console.error)

  // Save chat history async
  if (sessionId) {
    prisma.chatHistory.upsert({
      where: { sessionId },
      update: { messages, updatedAt: new Date() },
      create: { sessionId, userId: userId === 'anonymous' ? null : userId, messages },
    }).catch(console.error)
  }

  return new StreamingTextResponse(stream)
}
