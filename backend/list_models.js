import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to access client, but we need the model manager
        // The SDK structure for listing models might be different or not directly exposed easily in this version without a model instance context sometimes, 
        // but usually specifically:
        // Actually, currently getting the list might be done via raw fetch if SDK doesn't expose it easily in node.
        // Let's try to query a known fallback model first or just print error details if this fails.

        // Better approach: Use curl/fetch to hits the models endpoint directly to be sure.
        console.log("Fetching models...");
    } catch (e) {
        console.error(e);
    }
}

// Using direct fetch for clarity on 'list models' capability
import fs from 'fs';

async function fetchModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        const output = [];
        output.push("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    output.push(`- ${m.name}`);
                }
            });
        } else {
            output.push("No models found or error: " + JSON.stringify(data));
        }

        console.log(output.join('\n'));
        fs.writeFileSync('models.txt', output.join('\n'));
    } catch (e) {
        console.error("Error fetching models:", e);
        fs.writeFileSync('models.txt', "Error: " + e.message);
    }
}

fetchModels();
