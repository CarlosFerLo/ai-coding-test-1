# ai-coding-test-1

This repo, starts an investigation on how can we make ai manage large codebases and even contribute to github repos.

# Plan

In this first repo I will examine the hability of "gpt-3.5-turbo" to generate and update code.
Then I will add a retriver with documentation from the express library and try to set up a server just by querying the resulting pipeline

For make it easyer with testing I will set up a simple express server.

# Process

1. Implemented the simple chain that just queries the llm and returns the code, it is good at doing simple stuff but I hypothesise it wont be as good with more complex stuff. (simple.ts)

2. Implemented a chain that updates code, it is rudimentary as it requires the llm to rewrite the code but it performs sufficeintly well. While testing I started to see flaws on the understanding of the express library by the llm, this makes a stronger case for adding a retriver of the docs. (from_code.ts)

3. My previous prompts had one main flaw, they did not use the full potential of the model, to do so we will ask the model to think splicitely about how to perform a task before starting to code. El razonamiento permite que el llm resuelva tareas mas complejas, pero sigue sin resolverse el problema del uso erroneo de la libreria. (simple_thought.ts | from_code_thought.ts)