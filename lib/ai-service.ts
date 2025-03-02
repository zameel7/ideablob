import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Function to generate a response from the AI
export async function generateResponse(messages: Array<{ role: string; content: string }>) {
  try {
    // Convert messages to the format expected by Google Generative AI
    const formattedMessages = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Add system message as a user message at the beginning
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a helpful assistant for a note-taking app called IdeaBlob. Help the user organize their thoughts, suggest categories for notes, and provide helpful responses." }],
        },
        {
          role: "model",
          parts: [{ text: "I'll help you organize your thoughts, suggest categories for notes, and provide helpful responses as an assistant for IdeaBlob." }],
        },
        ...formattedMessages,
      ],
    });

    const result = await chat.sendMessage("");
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

// Function to suggest a category for a note
export async function suggestCategory(noteContent: string) {
  try {
    const prompt = `You are a helpful assistant for a note-taking app. Given a note, suggest a category from the following options: Personal, Work, Ideas, To-Do. Respond with just the category name.

Note: ${noteContent}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error suggesting category:", error);
    throw error;
  }
}

// Function to suggest tags for a note
export async function suggestTags(noteContent: string) {
  try {
    const prompt = `You are a helpful assistant for a note-taking app. Given a note, suggest up to 3 relevant tags. Respond with just the tags separated by commas, no additional text.

Note: ${noteContent}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const tagsString = response.text().trim();
    return tagsString.split(",").map((tag: string) => tag.trim()).filter(Boolean);
  } catch (error) {
    console.error("Error suggesting tags:", error);
    throw error;
  }
}

// Function to summarize a note
export async function summarizeNote(noteContent: string) {
  try {
    const prompt = `You are a helpful assistant for a note-taking app. Given a note, provide a brief summary in 1-2 sentences.

Note: ${noteContent}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error summarizing note:", error);
    throw error;
  }
} 