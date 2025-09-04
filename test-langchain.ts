import { AIMessageChunk, BaseMessage, HumanMessage } from '@langchain/core/messages'
import { DynamicStructuredTool, tool } from '@langchain/core/tools'
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import z from 'zod'

const greeter = tool(
  async ({ name }: { name: string }) => `Hello, ${name}!`,
  {
    name: 'greeter',
    description: 'A tool to greet users',
    schema: z.object({
      name: z.string().describe("The name to greet")
    }),
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
const toolsByName: Record<string, DynamicStructuredTool> = tools.reduce((acc, tool) => {
  acc[tool.name] = tool
  return acc
}, {} as Record<string, DynamicStructuredTool>)

async function main() {
  const llm = new ChatGoogleGenerativeAI({ model: 'gemini-2.5-flash' })
  const llmWithTools = llm.bindTools(tools)
  const questions = [
    'Hello, my name is Izana.',
    "How much is 5 + 5? then divide by 2"
  ]
  const messages: BaseMessage[] = []
  for (const q of questions) {
    messages.push(new HumanMessage(q))
    let answer = await llmWithTools.invoke(messages)
    messages.push(answer)

    const toolCall = async (message: AIMessageChunk) => {
      if (!message.tool_calls || message.tool_calls.length === 0) {
        return
      }

      for (const call of message.tool_calls) {
        const selectedTool = toolsByName[call.name]
        console.log('🛠️  Call:', call.name, JSON.stringify(call.args))
        const toolAnswer = await selectedTool?.invoke(call)
        if (toolAnswer) {
          messages.push(toolAnswer)
          console.log('🛠️ ', call.name + ':', toolAnswer.content)
        }
      }
      const finalAnswer = await llmWithTools.invoke(messages)
      messages.push(finalAnswer)
      await toolCall(finalAnswer)
    }
    await toolCall(answer)
    console.log('ℹ️ ', messages[messages.length - 1].content)
  }
}

main().then(() => {
  console.log("Done")
})

