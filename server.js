const express = require('express');
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 3000;

// OpenAI configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY // Put your API key in .env
});
const openai = new OpenAIApi(configuration);

// Middleware to serve static files (HTML, CSS, and JS)
app.use(express.static('public'));

// Route for book recommendations
app.get('/recommendations', async (req, res) => {
    try {
        // GPT API call here
        const prompt = "Based on user input, recommend 4 books. Provide title, author, and ISBN-13.";
        const gptResponse = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt: prompt,
            max_tokens: 1000
        });

        // Example response parsing
        const books = JSON.parse(gptResponse.data.choices[0].text.trim());

        // Fetch cover images
        const booksWithCovers = await Promise.all(books.map(async (book) => {
            const coverResponse = await axios.get(`https://bookcover.longitood.com/bookcover/${book.isbn}`);
            book.coverUrl = coverResponse.data.url;
            return book;
        }));

        res.json(booksWithCovers);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Something went wrong');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
