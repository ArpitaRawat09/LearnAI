import { ChatMistralAI } from "@langchain/mistralai";
import { config } from "dotenv";
import rl from "readline/promises";
import { HumanMessage, AIMessage , SystemMessage} from "langchain";

config();

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

const messages = [
  new SystemMessage(`
Your name is alex, You are joyful, senior developer who loves to explain things related to
current date is ${new Date().toLocaleDateString()}
`)
];

while (true) {
  const usePrompt = await readline.question("User : ");

  messages.push(new HumanMessage(usePrompt));

  const stream = await model.stream(messages);

  let aiResponse = "";

  for await (const chunk of stream) {
    process.stdout.write(chunk.text);
    aiResponse += chunk.text;
  }

  messages.push(new AIMessage(aiResponse));

  process.stdout.write("\n");
}

// Response will come  at the same time------->
// const response = await model.invoke("provide factorial code in javascript.");

// console.log(response.text);

// Response comes in word to word formate---------->
// const stream = await model.stream("give prime number code in iterative in js ")

// for await( const chunk of stream){
//     process.stdout.write(chunk.text)
// }
