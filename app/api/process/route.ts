import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, action,language } = await request.json();

    if (!text || !action || !language) {
  return NextResponse.json(
    { error: "Text, action, and language are required" },
    { status: 400 }
  );
}
const languageNames: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  mr: "Marathi",
  gu: "Gujarati",
  pa: "Punjabi",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  ml: "Malayalam",
  ur: "Urdu",
  or: "Odia",
  fr: "French",
  es: "Spanish",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  tr: "Turkish",
  ar: "Arabic",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
};

const selectedLanguage = languageNames[language];
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Sarvam API key is missing" },
        { status: 500 }
      );
    }

    // Translation
    if (action === "translate") {
      const response = await fetch("https://api.sarvam.ai/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": apiKey,
        },
        body: JSON.stringify({
          input: text,
          source_language_code: "auto",
          target_language_code: "hi-IN",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data },
          { status: response.status }
        );
      }

      return NextResponse.json({
        result: data.translated_text,
      });
    }

    // Other text actions
    const prompts: Record<string, string> = {
  friendly:
    "Rewrite the text in a friendly and warm tone. Return ONLY one final rewritten version. Do not provide alternatives, explanations, options, or extra text. Keep the original meaning.",

  empathy:
    "Rewrite the text with empathy and understanding. Return ONLY one final rewritten version. Do not provide alternatives, explanations, options, or extra text. Keep the original meaning.",

  urgent:
    "Rewrite the text in a clear and urgent tone. Return ONLY one final rewritten version. Do not provide alternatives, explanations, options, or extra text. Keep the original meaning.",

  grammar:
    "Correct the spelling and grammar. Return ONLY one final corrected version. Do not provide alternatives, explanations, options, or extra text. Keep the original meaning.",

  formal:
    "Rewrite the text in a professional and formal tone. Return ONLY one final rewritten version. Do not provide alternatives, explanations, options, or extra text. Keep the original meaning.",

  simplify:
    "Simplify the text so it is easy to understand. Return ONLY one final simplified version. Do not provide alternatives, explanations, options, or extra text. Keep the original meaning.",
};
    

    const prompt = prompts[action];

    if (!prompt) {
      return NextResponse.json(
        { error: "Invalid action selected" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.sarvam.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": apiKey,
        },
     body: JSON.stringify({
  model: "sarvam-105b",
  messages: [
   {
  role: "system",
  content: `${prompt} Write the final answer in ${selectedLanguage}. Return only one final answer.`,
},
    {
      role: "user",
      content: text,
    },
  ],
}),
      }
    );

   const responseText = await response.text();

let data;

try {
  data = JSON.parse(responseText);
} catch {
  data = { message: responseText };
}

if (!response.ok) {
  console.error("SARVAM STATUS:", response.status);
  console.error("SARVAM ERROR:", data);

  return NextResponse.json(
    { error: data },
    { status: response.status }
  );
}

    return NextResponse.json({
      result: data.choices[0].message.content,
    });
 } catch (error) {
  console.error("Server Error:", error);

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}
}