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
    inputVariables: ["input", "code"],
    template: trimText(
        "You are a programmer, you will be given a task and you will have to write code to solve it.",
        "Now it's time to think about how to solve the task. You will have to think about the task and how to solve it.",
        "You have to think about what the code actually does and how you can expand it to solve the task.",
        "You MUST NOT write code yet, just think about how to solve the task.",
        "Task: {input}",
        "Code:\n```{code}```",
        "Thought process: Let's work this out step by step to make sure we solve the task correctly.",
    ),
});

const thought_chain = new LLMChain({
    llm,
    prompt: thought_prompt,
});

const code_prompt = new PromptTemplate({
    inputVariables: ["input", "code", "thought"],
    template: trimText(
        "You are a programmer, you will be given a task and you will have to write code to solve it.",
        "It is important that you focus on the solving the task and nothing else.",
        "You will code on JavaScript.",
        "Task: {input}",
        "Code:\n```{code}```",
        "Thought process: {thought}",
        "\nUpdated code:",
    ) + "\n\n",
});

const code_chain = new LLMChain({
    llm,
    prompt: code_prompt,
});

export const from_code_thought_chain = async (input: string, code: string) => {
    const thought = await thought_chain.call({ input, code });
    const updated_code = await code_chain.call({ 
        input, 
        code,
        thought: thought[thought_chain.outputKey] 
    });
    
    return { 
        thought: thought[thought_chain.outputKey], 
        code: updated_code[code_chain.outputKey]
    };
};