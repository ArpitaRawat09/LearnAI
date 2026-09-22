import { ChatMistralAI } from "@langchain/mistralai";
import { config } from "dotenv";

config();

const model = new ChatMistralAI({
  model: "ministral-3b-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

// Response will come  at the same time------->
// const response = await model.invoke("provide factorial code in javascript.");

// console.log(response.text);



// Response comes in word to word formate---------->
const stream = await model.stream("give prime number code in iterative in js ")


for await( const chunk of stream){
    process.stdout.write(chunk.text)
}