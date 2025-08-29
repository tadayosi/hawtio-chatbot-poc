import { tool } from '@langchain/core/tools'
import z from 'zod'
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

const greetTool = tool(
  async ({ name }: { name: string }) => {
    return `Hello, ${name}!`
  },
  {
    name: 'greeter',
    description: 'A tool to greet users',
    schema: z.object({
      operation: z
        .enum(["greet"])
        .describe("Greeting"),
      name: z.string().describe("The name to greet")
    })
  }
)

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
  const llm = new ChatGoogleGenerativeAI({ model: 'gemini-2.5-flash' })
  const llmWithTools = llm.bindTools([greetTool, sumNumbers, divideNumbers])
  const response = await llmWithTools.invoke(['user', 'Hello, my name is Izana.'])
  console.log(response)
}

main().then(() => {
  console.log("Done")
})

