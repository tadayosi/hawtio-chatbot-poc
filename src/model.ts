import { Ollama } from '@llamaindex/ollama'
import { agent, AgentWorkflow } from '@llamaindex/workflow'
import { ChatMessage } from 'llamaindex'

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

export class Model {
  readonly llm: Ollama
  readonly chatAgent: AgentWorkflow

  constructor(readonly model: ModelId) {
    this.llm = new Ollama({ model: this.model.id, config: { host: 'http://localhost:11434' } })
    this.chatAgent = agent({ llm: this.llm, tools: [], verbose: true })
  }

  async chat(message: ChatMessage): Promise<string> {
    console.log('Chatting with', this.model.id, ':', message.content)
    try {
      const response = await this.llm.chat({ messages: [message] })
      console.log('Chat response:', response)
      return String(response.message.content)
    } catch (error) {
      console.error('Error while chatting:', error)
      return String(error)
    }
  }
}
