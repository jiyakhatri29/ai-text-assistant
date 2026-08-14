import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, action } = await request.json();

    if (!text || !action) {
      return NextResponse.json(
        { error: "Text and action are required" },
        { status: 400 }
      );
    }

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
      friendly: "Rewrite this text in a friendly and warm tone. Keep the meaning the same.",
      empathy: "Rewrite this text with empathy and understanding. Keep the meaning the same.",
      urgent: "Rewrite this text to sound clear and urgent. Keep the meaning the same.",
      grammar: "Fix the spelling and grammar of this text. Keep the meaning the same.",
      formal: "Rewrite this text in a professional and formal tone. Keep the meaning the same.",
      simplify: "Simplify this text so it is easy to understand. Keep the meaning the same.",
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
      content: prompt,
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
      { error: "Server error" },
      { status: 500 }
    );
  }
}