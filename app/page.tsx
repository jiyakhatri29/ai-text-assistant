"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [action, setAction] = useState("");
  const [result, setResult] = useState("");
  const [language, setLanguage] = useState("en");

  const handleSave = async () => {
  try {
    const response = await fetch("/api/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        action: action,
        language: language,

      }),
    });

    const data = await response.json();

   if (!response.ok) {
  console.error("API STATUS:", response.status);
  console.error("API RESPONSE:", data);
  alert(`API Error: ${response.status}`);
  return;
}

setResult(data.result);
  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Text Assistant
        </h1>

        <p className="text-gray-500 mb-6">
          Write, translate, or improve your text.
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter your text
        </label>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your sentence here..."
          className="w-full h-40 border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
          Select an action
        </label>

        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select an option</option>
          <option value="friendly">Friendly</option>
          <option value="empathy">Empathy</option>
          <option value="urgent">Urgent</option>
          <option value="grammar">Fix Grammar</option>
          <option value="formal">Make Formal</option>
          <option value="simplify">Simplify Language</option>
        </select>

        <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
  Select Language
</label>

<select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="en">English</option>
  <option value="hi">Hindi</option>
  <option value="bn">Bengali</option>
  <option value="mr">Marathi</option>
  <option value="gu">Gujarati</option>
  <option value="pa">Punjabi</option>
  <option value="ta">Tamil</option>
  <option value="te">Telugu</option>
  <option value="kn">Kannada</option>
  <option value="ml">Malayalam</option>
  <option value="ur">Urdu</option>
  <option value="or">Odia</option>
  <option value="fr">French</option>
  <option value="es">Spanish</option>
  <option value="de">German</option>
  <option value="it">Italian</option>
  <option value="pt">Portuguese</option>
  <option value="tr">Turkish</option>
  <option value="ar">Arabic</option>
  <option value="ru">Russian</option>
  <option value="ja">Japanese</option>
  <option value="ko">Korean</option>
  <option value="zh">Chinese</option>
</select>

        <button
          onClick={handleSave}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Save
        </button>
        {result && (
  <div className="mt-6 p-4 rounded-lg bg-gray-50 border">
    <h2 className="font-semibold mb-2">Result</h2>
    <p className="text-gray-700">{result}</p>
  </div>
)}

      </div>
    </main>
  );
}