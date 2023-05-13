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
    inputVariables: ["input", "code"],
    template: trimText(
        "You are a programmer, you are given a task and some code and you have to update the code to solve the task.",
        "It is important that you focus on the solving the task and nothing else.",
        "You will code on JavaScript.",
        "Task: {input}",
        "Code:\n```{code}```",
        "\nUpdated code:",
    ) + "\n\n",
});

export const from_code_chain = new LLMChain({
    llm,
    prompt,
});