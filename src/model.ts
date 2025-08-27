import { BaseLanguageModelInput } from '@langchain/core/language_models/base'
import { AIMessageChunk, MessageContent } from '@langchain/core/messages'
import { Runnable } from '@langchain/core/runnables'
import { tool } from '@langchain/core/tools'
import { ChatOllama, ChatOllamaCallOptions } from "@langchain/ollama"
import { Ollama } from '@llamaindex/ollama'
import { agent, AgentWorkflow } from '@llamaindex/workflow'
import z from 'zod'

type ModelId = { id: string; name: string, tool: boolean }
export const MODELS: ModelId[] = [
  { id: 'granite3.1-moe:latest', name: 'Granite 3.1 Moe', tool: true },
  { id: 'granite3.1-dense:latest', name: 'Granite 3.1 Dense', tool: true },
  { id: 'llama3:latest', name: 'Llama 3', tool: false },
  { id: 'llama3.2:latest', name: 'Llama 3.2', tool: true },
  { id: 'llama3.2-vision:latest', name: 'Llama 3.2 Vision', tool: true },
  { id: 'phi4:latest', name: 'Phi 4', tool: false },
  { id: 'phi3.5:latest', name: 'Phi 3.5', tool: false },
  { id: 'qwen3:4b', name: 'Qwen 3 4B', tool: true },
  { id: 'qwen3:latest', name: 'Qwen 3', tool: true }
] as const

export type BotMessage = {
  content: string
  think?: string
}

export class LlamaIndexModel {
  readonly llm: Ollama
  readonly chatAgent: AgentWorkflow

  constructor(readonly model: ModelId) {
    this.llm = new Ollama({ model: this.model.id, config: { host: 'http://localhost:11434' } })
    this.chatAgent = agent({ llm: this.llm, tools: [], verbose: true })
  }

  async chat(message: string): Promise<string> {
    console.log('Chatting with', this.model.id, ':', message)
    try {
      const response = await this.llm.chat({ messages: [{ content: message, role: 'user' }] })
      console.log('Chat response:', response)
      return String(response.message.content)
    } catch (error) {
      console.error('Error while chatting:', error)
      return String(error)
    }
  }
}

export class LangChainModel {
  readonly llm: ChatOllama
  readonly agent: Runnable<BaseLanguageModelInput, AIMessageChunk, ChatOllamaCallOptions>

  constructor(readonly model: ModelId) {
    this.llm = new ChatOllama({ model: this.model.id })
    this.agent = this.llm.bindTools([greetTool])
  }

  async chat(message: string): Promise<BotMessage> {
    console.log('Chatting with', this.model.id, ':', message)
    try {
      const response = await this.agent.invoke(["user", message])
      console.log('Chat response:', response)
      return this.toBotMessage(response.content)
    } catch (error) {
      console.error('Error while chatting:', error)
      return { content: String(error) }
    }
  }

  private toBotMessage(message: MessageContent): BotMessage {
    const str = String(message)
    // extract inside <think>...</think> from message
    const think = str.match(/<think>(.*?)<\/think>/s)?.[1]?.trim()
    // remove <think>...</think> from message
    const content = str.replace(/<think>.*?<\/think>/s, '')
    console.log('Response - content:', content, 'think:', think)
    return { content, think }
  }
}

const greetSchema = z.object({
  operation: z
    .enum(["greet"])
    .describe("Greeting"),
  name: z.string().describe("The name to greet")
})

const greetTool = tool(
  async ({ name }: { name: string }) => {
    return `Hello, ${name}!`
  },
  {
    name: 'greeter',
    description: 'A tool to greet users',
    schema: greetSchema
  }
)
