import express from 'express'; // Import express
import * as dotenv from 'dotenv'; // Import dotenv

import { simple_chain } from './chains/simple'; // Import simple chain
import { simple_thought_chain } from './chains/simple_thought'; // Import simple thought chain
import { from_code_chain } from './chains/from_code'; // Import from code chain
import { from_code_thought_chain } from './chains/from_code_thought'; // Import from code thought chain

dotenv.config(); // Load .env file

const app = express(); // Create express app
const port = process.env.PORT || 8000; // Set default port

app.use(express.json()); // Use express json body parser to be able to read json body

// Check if server is running correctly
app.get('/', (_req, res) => {
    res.status(200).send('Hello World!');
});

// Route that returns code generated from the given input
app.post("/simple", async (req, res) => {
    try {
        const input = req.body.input as string; // Get input from query
        console.log(`Input: ${input}`); // Log input

        const code = await simple_chain.call({ input }); // Run chain with input
        console.log(`Code:\n${code[simple_chain.outputKey]}`); // Log code

        // Return code
        res.status(200).send({
            code: code[simple_chain.outputKey],
        }) 

    } catch (error) { // Catch errors
        console.error(error);
        res.status(500).send({
            error: error.message,
        });
    }
});

// Route that returns code generated from the given input and code
app.post("/from_code", async (req, res) => {
    try {
        const { input, code } = req.body; // Get input and code from query
        console.log(`Input: ${input}`); // Log input
        console.log(`Code:\n${code}`); // Log code

        const updated_code = await from_code_chain.call({ input, code }); // Run chain with input and code
        console.log(`Updated code:\n${updated_code[simple_chain.outputKey]}`); // Log updated code

        // Return updated code
        res.status(200).send({
            code: updated_code[simple_chain.outputKey],
        });
    } catch (error) { // Catch errors
        console.error(error);
        res.status(500).send({
            error: error.message,
        });
    }
});

// Route that returns code generated from the given input using simple thought chain
app.post("/simple_thought", async (req, res) => {
    try {
        const input = req.body.input as string; // Get input from query
        console.log(`Input: ${input}`); // Log input

        const { code, thought } = await simple_thought_chain(input); // Run chain with input
        console.log(`\nThought:\n${thought}`); // Log thought
        console.log(`\nCode:\n${code}`); // Log code

        // Return code
        res.status(200).send({
            code: code,
            thought: thought,
        }) 

    } catch (error) { // Catch errors
        console.error(error);
        res.status(500).send({
            error: error.message,
        });
    }
});

// Route that returns code generated from the given input and code using simple thought chain
app.post("/from_code_thought", async (req, res) => {
    try {
        const { input, code } = req.body; // Get input and code from query
        console.log(`Input: ${input}`); // Log input
        console.log(`Code:\n${code}`); // Log code

        const { code: updated_code, thought } = await from_code_thought_chain(input, code); // Run chain with input and code
        console.log(`\nThought:\n${thought}`); // Log thought
        console.log(`\nUpdated code:\n${updated_code}`); // Log updated code

        // Return updated code
        res.status(200).send({
            code: updated_code,
            thought: thought,
        });
    } catch (error) { // Catch errors
        console.error(error);
        res.status(500).send({
            error: error.message,
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
