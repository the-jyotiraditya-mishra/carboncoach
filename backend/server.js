import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://YOUR-VERCEL-URL.vercel.app"
    ],
    credentials: true
}));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
    res.json({ message: "CarbonCoach IQ backend running" });
});

app.post("/api/ai/coach", async (req, res) => {
    try {
        const { todayTotal, activities, question } = req.body;

        const prompt = `
You are CarbonCoach IQ, a friendly AI carbon footprint coach.

User's total carbon emission today: ${todayTotal} kg CO2.

User activities:
${JSON.stringify(activities, null, 2)}

User question:
${question}

Give a short, practical, personalized answer.
Use simple language.
Give 3 actionable climate tips.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.json({
            reply: response.text,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "AI coach failed",
        });
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});