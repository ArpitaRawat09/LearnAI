import { ChatMistralAI } from "@langchain/mistralai";
import { config } from "dotenv";
import rl from "readline/promises";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  tool,
  createAgent,
} from "langchain";
import * as z from "zod";
import { tavily } from "@tavily/core";

config();

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function getLatestInformation({ query }) {
  const response = await tvly.search(query);

  const results = response.results;

  const content = results.map((results) => results.content).join("\n\n\n");

  return content;
}

const getLatestInformationTool = tool(getLatestInformation, {
  name: "get_latest_information",
  description: "Get latest information about any topic",
  schema: z.object({
    query: z.string().describe("The topic to get latest information about"),
  }),
});

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// const usePrompt = await readline.question("Enter your Prompt:")
// console.log(usePrompt);
// readline.close();

const model = new ChatMistralAI({
  model: "ministral-3b-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const agent = createAgent({
  model,
  tools: [getLatestInformationTool],
});

const messages = [
  new SystemMessage(`
Your name is alex, You are joyful, senior developer who loves to explain things related to
current date is ${new Date().toLocaleDateString()}
`),
];

while (true) {
  const usePrompt = await readline.question("User : ");

  messages.push(new HumanMessage(usePrompt));

  const stream = await agent.stream(
    {
      messages,
    },
    {
      streamMode: "messages",
    },
  );

  let aiResponse = "";

  for await (const [chunk] of stream) {
    process.stdout.write(chunk.text);
    aiResponse += chunk.text;
  }

  messages.push(new AIMessage(aiResponse));

  process.stdout.write("\n\n\n\n");
}

// Response will come  at the same time------->
// const response = await model.invoke("provide factorial code in javascript.");

// console.log(response.text);

// Response comes in word to word formate---------->
// const stream = await model.stream("give prime number code in iterative in js ")

// for await( const chunk of stream){
//     process.stdout.write(chunk.text)
// }
