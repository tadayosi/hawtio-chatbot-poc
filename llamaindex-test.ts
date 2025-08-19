import { Ollama, OllamaEmbedding } from "@llamaindex/ollama"
import { agent } from "@llamaindex/workflow"
import { Settings, tool } from "llamaindex"
import { z } from "zod"

const model = new Ollama({ model: 'qwen3', config: { host: "http://localhost:11434" } })
const embedModel = new OllamaEmbedding({ model: 'qwen3', config: { host: "http://localhost:11434" } })

Settings.llm = model
Settings.embedModel = embedModel

const sumNumbers = tool({
  name: "sumNumbers",
  description: "Use this function to sum two numbers",
  parameters: z.object({
    a: z.number().describe("The first number"),
    b: z.number().describe("The second number"),
  }),
  execute: ({ a, b }: { a: number; b: number }) => `${a + b}`,
})
const divideNumbers = tool({
  name: "divideNumbers",
  description: "Use this function to divide two numbers",
  parameters: z.object({
    a: z.number().describe("The dividend a to divide"),
    b: z.number().describe("The divisor b to divide by"),
  }),
  execute: ({ a, b }: { a: number; b: number }) => `${a / b}`,
})

async function main() {
  const mathAgent = agent({
    tools: [sumNumbers, divideNumbers],
    llm: model,
    verbose: true,
  })

  const response = await mathAgent.run("How much is 5 + 5? then divide by 2")
  console.log(response.data)
}

main().then(() => {
  console.log("Done")
})
