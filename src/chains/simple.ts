import * as dotenv from "dotenv";

import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";

import { trimText } from "../utils/trimText";

dotenv.config();

const llm = new OpenAI({
    temperature: 0,
});

const prompt = new PromptTemplate({
    inputVariables: ["input"],
    template: trimText(
        "You are a programmer, you will be given a task and you will have to write code to solve it.",
        "It is important that you focus on the solving the task and nothing else.",
        "You will code on JavaScript.",
        "Task: {input}",
        "\nCode:",
    ) + "\n\n",
});

export const simple_chain = new LLMChain({
    llm,
    prompt,
}) ;


