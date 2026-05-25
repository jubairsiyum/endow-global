import OpenAI from 'openai'
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { BufferWindowMemory } from 'langchain/memory'

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export const chatModel = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0.3,
  streaming: true,
  openAIApiKey: process.env.OPENAI_API_KEY!,
})

export const embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-3-small',
  openAIApiKey: process.env.OPENAI_API_KEY!,
})

let vectorStore: PineconeStore | null = null

export async function getVectorStore() {
  if (vectorStore) return vectorStore
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'endow-courses')
  vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index })
  return vectorStore
}

export const CHATBOT_SYSTEM_PROMPT = `You are Endow Assistant, a helpful AI counselor for Endow Global Education.
You help students with questions about studying abroad, university applications, visa requirements, scholarship opportunities, and course selection.
You have access to Endow's knowledge base about universities, courses, and application processes.
Always be encouraging, professional, and accurate. If you don't know something, say so and suggest contacting a human counselor.
Keep responses concise but complete. Use bullet points for lists. Format currency amounts clearly.`
