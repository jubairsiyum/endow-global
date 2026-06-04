import { StreamingTextResponse, LangChainStream } from 'ai'
import { ChatOpenAI } from '@langchain/openai'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { getVectorStore, CHATBOT_SYSTEM_PROMPT } from '@/lib/openai'
import { auth } from '@/lib/auth'
import { rateLimit } from '@/lib/redis'
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
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

  const chain = ConversationalRetrievalQAChain.fromLLM(model as any, retriever as any, {
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
    db.query.chatHistory.findFirst({ where: (ch, { eq }) => eq(ch.sessionId, sessionId) }).then(existing => {
      if (existing) {
        return db.update(schema.chatHistory)
          .set({ messages, updatedAt: new Date() })
          .where(eq(schema.chatHistory.id, existing.id))
      } else {
        return db.insert(schema.chatHistory).values({
          sessionId,
          userId: userId === 'anonymous' ? null : userId,
          messages,
        })
      }
    }).catch(console.error)
  }

  return new StreamingTextResponse(stream)
}
