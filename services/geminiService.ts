import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

type ImageData = {
  data: string; // base64 encoded string
  mimeType: string;
};

export const compareFaces = async (image1: ImageData, image2: ImageData): Promise<boolean> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: image1.mimeType,
              data: image1.data,
            },
          },
          {
            inlineData: {
              mimeType: image2.mimeType,
              data: image2.data,
            },
          },
          {
            text: "Analyze the two images provided. Is the person in the first image the same individual as the person in the second image? Your entire response must be only the word 'Yes' or 'No'.",
          },
        ],
      },
    });

    const resultText = response.text.trim().toLowerCase();
    return resultText === 'yes';
  } catch (error) {
    console.error("Error comparing faces with Gemini API:", error);
    // Re-throw to be handled by the calling function
    throw new Error("Failed to get a valid response from the AI model.");
  }
};
