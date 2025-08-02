import { GoogleGenAI, Type } from "@google/genai";
import { Ruler, Portrait } from '../types';
import { CARDS_PER_ROUND } from '../constants';
import { DECOY_IMAGES } from '../data/decoyImages';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const shuffleArray = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const fetchRulers = async (): Promise<Ruler[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a list of 3 famous world rulers from different historical periods and regions (e.g., Ancient Egypt, Roman Empire, Mongol Empire). For each ruler, provide their common name and a concise, visually descriptive prompt for an AI image generator to create a realistic portrait. The description should focus on their typical appearance, clothing, headwear, and any notable facial features based on historical art and descriptions. Return the list as a JSON array of objects.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "The ruler's common name." },
              description: { type: Type.STRING, description: "A visual prompt for an image generator." }
            },
            required: ["name", "description"]
          }
        }
      }
    });
    
    const jsonText = response.text.trim();
    const rulers: Ruler[] = JSON.parse(jsonText);
    return rulers;
  } catch (error) {
    console.error("Error fetching rulers:", error);
    // Return a fallback list in case of API failure
    return [
      { name: "Cleopatra", description: "A beautiful Egyptian queen with dark braided hair, kohl eyeliner, and a golden asp headdress, wearing white linen robes." },
      { name: "Julius Caesar", description: "A middle-aged Roman general with a laurel wreath on his short, dark hair, a strong jaw, and wearing a red toga." },
      { name: "Genghis Khan", description: "A formidable Mongol warrior with a long, thin mustache and beard, wearing a fur-trimmed hat and leather armor." },
      { name: "Queen Elizabeth I", description: "An English queen with a high, pale forehead, elaborate red hair, wearing a large white ruff collar and a gown adorned with pearls." },
      { name: "Napoleon Bonaparte", description: "A French emperor with a determined expression, wearing a black bicorne hat and a blue military uniform with gold epaulets, his hand tucked into his jacket." },
      { name: "Mansa Musa", description: "An incredibly wealthy West African emperor from Mali, depicted in golden robes, holding a golden nugget and a golden scepter." },
      { name: "Ashoka the Great", description: "An ancient Indian emperor of the Maurya Dynasty, with a calm and wise expression, simple robes, and early Buddhist symbols." },
      { name: "Suleiman the Magnificent", description: "An Ottoman sultan with a large, white turban, a well-groomed beard, and wearing ornate, jeweled robes." },
      { name: "Qin Shi Huang", description: "The first Emperor of China, with a stern look, wearing an imperial black robe with dragon embroidery and a formal emperor's crown (mian'guan)." },
      { name: "Cyrus the Great", description: "The founder of the Achaemenid Empire of Persia, depicted with a long, curled beard and hair, wearing a royal purple robe and a simple circlet." },
    ];
  }
};

const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'stable-diffusion',
            prompt: `A highly detailed and photorealistic portrait of a historical figure: ${prompt}`,
            config: {
                num_images: 1,
                output_format: 'jpeg',
                aspect_ratio: '3:4',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
            return response.generatedImages[0].image.imageBytes;
        }
        
        console.error("Invalid response from generateImages API:", response);
        throw new Error("Failed to get imageBytes from API response. The response was empty or malformed.");

    } catch (error) {
        console.error(`Error during image generation for prompt "${prompt}":`, error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

export const generatePortraitsForRound = async (ruler: Ruler): Promise<Portrait[]> => {
    // 1. Generate the single correct AI image
    const correctImageBase64 = await generateImage(ruler.description);
    const correctPortrait: Portrait = {
        imageUrl: `data:image/jpeg;base64,${correctImageBase64}`,
        isCorrect: true,
    };

    // 2. Select random decoy images from our static list
    const decoyCount = CARDS_PER_ROUND - 1;
    const shuffledDecoys = shuffleArray([...DECOY_IMAGES]);
    const selectedDecoys = shuffledDecoys.slice(0, decoyCount);

    const decoyPortraits: Portrait[] = selectedDecoys.map(url => ({
        imageUrl: url,
        isCorrect: false,
    }));

    // 3. Combine and shuffle the correct portrait with the decoys
    const allPortraits = shuffleArray([correctPortrait, ...decoyPortraits]);
    
    return allPortraits;
};