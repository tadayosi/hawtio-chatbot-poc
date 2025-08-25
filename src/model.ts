import { Ollama } from '@llamaindex/ollama'
import { agent, AgentWorkflow } from '@llamaindex/workflow'
import { fa } from 'zod/v4/locales'

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
  private readonly llm: Ollama
  private readonly agent: AgentWorkflow

  constructor(private readonly model: ModelId) {
    this.llm = new Ollama({ model: this.model.id, config: { host: 'http://localhost:11434' } })
    this.agent = agent({ llm: this.llm, verbose: true })
  }
}
