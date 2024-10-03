import React, { useState } from "react";

const JobDescription = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const generateContent = async () => {
    const apiKey = ""; // Replace with your actual API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful assistant that generates a paragraph of a job description based on a job title provided by the user. Focus on highlighting the key responsibilities of the role, and start the description with 'We are'.If you are unable to generate the job description for given title or it exceeds your ethical guidelines or any thing asked except job title you should say,this that' No description found for this job title'.The job title is ${prompt}`,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.candidates[0].content.parts[0].text);
        setResponse(
          data.candidates[0].content.parts[0].text || "No response generated."
        );
        setError("");
      } else {
        setError(data.error.message || "Error generating content.");
      }
    } catch (err) {
      console.log(err);
      setError("Network or server error.");
    }
  };

  return (
    <div>
      <h1>AI Content Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter Job title"
      />
      <button onClick={generateContent}>Generate Content</button>

      {response && (
        <div>
          <h3>AI Response:</h3>
          <p>{response}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default JobDescription;
