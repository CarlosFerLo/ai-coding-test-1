import * as dotenv from "dotenv";

import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";

import { trimText } from "../utils/trimText";

dotenv.config();

const llm = new OpenAI({
    temperature: 0,
});

const thought_prompt = new PromptTemplate({
    inputVariables: ["input"],
    template: trimText(
        "You are a programmer, you will be given a task and you will have to write code to solve it.",
        "Now it's time to think about how to solve the task. You will have to think about the task and how to solve it.",
        "You don't have to write code yet, just think about how to solve the task.",
        "Task: {input}",
        "Thought process: Let's work this out step by step to make sure we solve the task correctly.",
    ),
});

const thought_chain = new LLMChain({
    llm,
    prompt: thought_prompt,
    outputKey: "thought",
});

const code_prompt = new PromptTemplate({
    inputVariables: ["input", "thought"],
    template: trimText(
        "You are a programmer, you will be given a task and you will have to write code to solve it.",
        "It is important that you focus on the solving the task and nothing else.",
        "You will code on JavaScript.",
        "Task: {input}",
        "Thought process: {thought}",
        "\nCode:",
    ) + "\n\n",
});

const code_chain = new LLMChain({
    llm,
    prompt: code_prompt,
});

export const simple_thought_chain = async (input: string) => {
    const thought = await thought_chain.call({ input });
    const code = await code_chain.call({ 
        input, 
        thought: thought[thought_chain.outputKey] 
    });
    
    return { 
        thought: thought[thought_chain.outputKey], 
        code: code[code_chain.outputKey]
    };
}
