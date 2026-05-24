const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function askAI(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error('AI Error:', error);
    throw error;
  }
}

export const AI_PROMPTS = {
  SUMMARIZE: (content: string, lang: 'th' | 'en') => 
    lang === 'th' 
      ? `สรุปเนื้อหาต่อไปนี้ให้สั้นกระชับและเป็นมืออาชีพ:\n\n${content}`
      : `Summarize the following content in a concise and professional manner:\n\n${content}`,
  
  SUGGEST_TOOLS: (content: string) => 
    `Analyze the following text and suggest a list of technical tools, libraries, or technologies mentioned or relevant. Return ONLY a comma-separated list of names (e.g. React, Node.js, Docker):\n\n${content}`,
  
  IMPROVE_WRITING: (content: string, lang: 'th' | 'en') => 
    lang === 'th'
      ? `ช่วยเรียบเรียงเนื้อหาต่อไปนี้ให้ดูเป็นทางการและสละสลวยขึ้น:\n\n${content}`
      : `Improve the grammar, style, and professionalism of the following text:\n\n${content}`,
};
