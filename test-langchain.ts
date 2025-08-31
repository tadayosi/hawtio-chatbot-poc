import { AIMessageChunk } from '@langchain/core/messages'
import { tool } from '@langchain/core/tools'
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import z from 'zod'

const greeter = tool(
  async ({ name }: { name: string }) => `Hello, ${name}!`,
  {
    name: 'greeter',
    description: 'A tool to greet users',
    schema: z.object({
      name: z.string().describe("The name to greet")
    })
  }
)

const sumNumbers = tool(
  async ({ a, b }: { a: number; b: number }) => a + b,
  {
    name: "sumNumbers",
    description: "Use this function to sum two numbers",
    schema: z.object({
      a: z.number().describe("The first number"),
      b: z.number().describe("The second number"),
    }),
  }
)

const divideNumbers = tool(
  async ({ a, b }: { a: number; b: number }) => a / b,
  {
    name: "divideNumbers",
    description: "Use this function to divide two numbers",
    schema: z.object({
      a: z.number().describe("The dividend a to divide"),
      b: z.number().describe("The divisor b to divide by"),
    }),
  }
)

const tools = [greeter, sumNumbers, divideNumbers]
const toolsByName: Record<string, typeof tools[number]> = tools.reduce((acc, tool) => {
  acc[tool.name] = tool
  return acc
}, {} as Record<string, typeof tools[number]>)

async function main() {
  const llm = new ChatGoogleGenerativeAI({ model: 'gemini-2.5-flash' })
  const llmWithTools = llm.bindTools(tools)
  const questions = [
    'Hello, my name is Izana.',
    "How much is 5 + 5? then divide by 2"
  ]
  const messages: AIMessageChunk[] = []
  for (const q of questions) {
    const result = await llmWithTools.invoke(['user', q])
    messages.push(result)
    if (!result.tool_calls) {
      console.log(result.content)
    } else {
      for (const call of result.tool_calls) {
        const selectedTool = toolsByName[call.name]
        console.log(`Tool to call: ${call.name}`)
        console.log(`Args: ${JSON.stringify(call.args)}`)
        const toolMessage = await selectedTool?.invoke(call)
      }
    }
  }
}

main().then(() => {
  console.log("Done")
})

