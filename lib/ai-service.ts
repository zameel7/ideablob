import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Function to get API key from localStorage (client-side only)
function getApiKey(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('googleAiApiKey') || '';
  }
  return '';
}

// Function to initialize the AI client with the current API key
function initializeAiClient() {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return { genAI: null, model: null };
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      }
    });
    
    return { genAI, model };
  } catch (error) {
    console.error("Error initializing Google Generative AI:", error);
    return { genAI: null, model: null };
  }
}

// Helper function to check if API is configured
function checkApiConfigured() {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("Google AI API key is not configured. Please add your API key in the settings.");
  }
  
  const { genAI, model } = initializeAiClient();
  
  if (!genAI || !model) {
    throw new Error("Google Generative AI client is not properly initialized.");
  }
  
  return { genAI, model };
}

// Function to generate a response from the AI
export async function generateResponse(messages: Array<{ role: string; content: string }>) {
  try {
    const { model } = checkApiConfigured();
    
    // Create a chat session with initial system prompt
    const systemPrompt = "You are a helpful assistant for a note-taking app called IdeaBlob. Help the user organize their thoughts, suggest categories for notes, and provide helpful responses.";
    
    // Extract the last user message
    const lastUserMessage = messages.filter(msg => msg.role === "user").pop();
    
    if (!lastUserMessage || !lastUserMessage.content.trim()) {
      throw new Error("No valid user message to process");
    }
    
    // Format history for the chat
    const history = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "I'll help you organize your thoughts, suggest categories for notes, and provide helpful responses as an assistant for IdeaBlob." }],
      },
      // Add previous messages except the last user message
      ...messages
        .filter(msg => msg !== lastUserMessage)
        .map(msg => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
    ];
    
    // Create chat session
    const chatSession = model.startChat({
      history: history,
    });

    // Send the last user message instead of an empty string
    const result = await chatSession.sendMessage(lastUserMessage.content);
    return result.response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

// Function to suggest a category for a note
export async function suggestCategory(noteContent: string) {
  try {
    const { model } = checkApiConfigured();
    
    const prompt = `You are a helpful assistant for a note-taking app. Given a note, suggest a category from the following options: Personal, Work, Ideas, To-Do. Respond with just the category name.

Note: ${noteContent}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error suggesting category:", error);
    throw error;
  }
}

// Function to suggest tags for a note
export async function suggestTags(noteContent: string) {
  try {
    const { model } = checkApiConfigured();
    
    const prompt = `You are a helpful assistant for a note-taking app. Given a note, suggest up to 3 relevant tags. Respond with just the tags separated by commas, no additional text.

Note: ${noteContent}`;

    const result = await model.generateContent(prompt);
    const tagsString = result.response.text().trim();
    return tagsString.split(",").map((tag: string) => tag.trim()).filter(Boolean);
  } catch (error) {
    console.error("Error suggesting tags:", error);
    throw error;
  }
}

// Function to summarize a note
export async function summarizeNote(noteContent: string) {
  try {
    const { model } = checkApiConfigured();
    
    const prompt = `You are a helpful assistant for a note-taking app. Given a note, provide a brief summary in 1-2 sentences.

Note: ${noteContent}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error summarizing note:", error);
    throw error;
  }
} 