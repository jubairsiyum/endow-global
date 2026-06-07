import OpenAI from 'openai'
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'
import { lazyClient } from './lazy-client'

export const openai = lazyClient<OpenAI>(() => {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not set')
  return new OpenAI({ apiKey: key })
}, 'OpenAI')

export const chatModel = lazyClient<ChatOpenAI>(() => {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not set')
  return new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.3,
    streaming: true,
    openAIApiKey: key,
  })
}, 'ChatOpenAI')

export const embeddings = lazyClient<OpenAIEmbeddings>(() => {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not set')
  return new OpenAIEmbeddings({
    modelName: 'text-embedding-3-small',
    openAIApiKey: key,
  })
}, 'OpenAIEmbeddings')

let vectorStore: PineconeStore | null = null

export async function getVectorStore() {
  if (vectorStore) return vectorStore
  const key = process.env.PINECONE_API_KEY
  if (!key) throw new Error('PINECONE_API_KEY is not set')
  const pinecone = new Pinecone({ apiKey: key })
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'endow-courses')
  vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index })
  return vectorStore
}

export const CHATBOT_SYSTEM_PROMPT = `You are Endow Assistant, a helpful AI counselor for Endow Global Education.
You help students with questions about studying abroad, university applications, visa requirements, scholarship opportunities, and course selection.
You have access to Endow's knowledge base about universities, courses, and application processes.
Always be encouraging, professional, and accurate. If you don't know something, say so and suggest contacting a human counselor.
Keep responses concise but complete. Use bullet points for lists. Format currency amounts clearly.`
