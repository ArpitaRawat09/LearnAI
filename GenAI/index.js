import { ChatMistralAI } from "@langchain/mistralai";
import { config } from "dotenv";

config();

const model = new ChatMistralAI({
  model: "ministral-3b-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const response = await model.invoke("Hello");

console.log(response.text);
