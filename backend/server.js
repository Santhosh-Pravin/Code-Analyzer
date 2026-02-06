import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = 8001;

// Configure Middleware
app.use(cors());
app.use(express.json());

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure Gemini
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
// Use gemini-1.5-flash as it is stable and fast
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// AI Helper Function
async function analyzeCodeWithGemini(codeContent, filename) {
    const prompt = `
    You are an expert software engineer and code mentor. 
    Analyze the following source code from a file named "${filename}".
    
    Please provide the output in the following JSON format ONLY (no markdown backticks around the json):
    {
        "summary": "A brief 2-3 sentence summary of what this code does.",
        "explanation": "A simple, beginner-friendly explanation of the main functions, classes, and logic flow.",
        "quality_analysis": {
            "complexity": "Low/Medium/High",
            "readability_score": "1-10",
            "suggestions": ["List of specific suggestions to improve the code", "Another suggestion"]
        },
        "key_components": [
            {"name": "function_or_class_name", "description": "What it does"}
        ]
    }

    Here is the code:
    
    ${codeContent}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Cleanup markdown if present
        if (text.startsWith('```json')) {
            text = text.substring(7);
        }
        if (text.startsWith('```')) {
            text = text.substring(3);
        }
        if (text.endsWith('```')) {
            text = text.substring(0, text.length - 3);
        }
        return text;
    } catch (error) {
        console.error("Gemini Error Details:", JSON.stringify(error, null, 2));
        console.error("Gemini Error Message:", error.message);
        console.error("Gemini Error Stack:", error.stack);
        throw new Error(`Failed to analyze code with AI: ${error.message}`);
    }
}

app.get('/', (req, res) => {
    res.send({ message: 'AI Code Analyzer API is running (Gemini Integrated)' });
});

app.post('/analyze', upload.single('file'), async (req, res) => {
    try {
        let content = "";
        let filename = "snippet";

        if (req.file) {
            content = req.file.buffer.toString('utf-8');
            filename = req.file.originalname;
        } else if (req.body.code_text) {
            content = req.body.code_text;
        } else {
            return res.status(400).json({ detail: "Either file or code_text must be provided." });
        }

        if (!content.trim()) {
            return res.status(400).json({ detail: "Code content is empty." });
        }

        const jsonString = await analyzeCodeWithGemini(content, filename);

        try {
            const data = JSON.parse(jsonString);
            res.json(data);
        } catch (e) {
            // Fallback for raw text
            res.json({
                summary: "Analysis completed but format was raw.",
                explanation: jsonString,
                quality_analysis: { complexity: "Unknown", readability_score: "N/A", suggestions: [] },
                key_components: []
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ detail: error.message });
    }
});

app.post('/chat', async (req, res) => {
    const { history, question, code_context } = req.body;

    try {
        const validHistory = (history || []).map(h => ({
            role: h.role,
            parts: h.parts.map(p => ({ text: p.text || p })) // Ensure text property structure matches SDK or simple string
        }));

        // The JS SDK expects parts to be [{text: "..."}]. 
        // Our previous python-like structure was just string array in parts sometimes.
        // Let's ensure it maps correctly.

        const chat = model.startChat({
            history: validHistory
        });

        const msg = `
        Context: The user is asking questions about the following code:
        ${code_context}
        
        User Question: ${question}
        
        Answer the user's question simply and clearly, referencing the code where necessary.
        `;

        const result = await chat.sendMessage(msg);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ response: "I encountered an error answering that." });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
