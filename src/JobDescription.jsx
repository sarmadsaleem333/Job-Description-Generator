import React, { useState } from "react";

const JobDescription = () => {
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [error, setError] = useState("");

  const generateContent = async () => {
    const apiKey = "AIzaSyAvNVzRtjCnW7tWeIa0sS4pYIDGHz_TLZY";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful assistant that generates a comprehensive job description based on a job title provided by the user. 
                Your response should include the following sections:
                1. "We are" statement introducing the job description not specifying our company only providing job description summary for the given title for 3-4 lines.
                2. Key responsibilities (5-6 bullet points).
                3. Requirements (5-6 bullet points).
                4. Random 6-7 benefits related to the job maybe like monthly team dinners, outings.
                
                The job title is: ${prompt}. Give me response in the format of a JavaScript object with keys description, responsibilities, requirements, benefits and values as arrays of strings.
               If there is no job user entered or If you cannot provide a description for the given job title or it exceeds ethical guidelines, reply with the following empty JavaScript object: { "description": "No description found for this job title", "responsibilities": [], "requirements": [], "benefits": [] }.`,
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
        console.log("data", data);
        const generatedText = data.candidates[0].content.parts[0].text;

        const jsonString = generatedText.replace(/```json\n|\n```/g, "").trim();
        const parsedData = JSON.parse(jsonString);

        console.log("Parsed data:", parsedData);

        // Set state based on parsed data
        setDescription(parsedData.description);
        setResponsibilities(parsedData.responsibilities);
        setRequirements(parsedData.requirements);
        setBenefits(parsedData.benefits);

        setError("");
      } else {
        // Fallback to a structured response indicating no description
        setDescription("No description found for this job title.");
        setResponsibilities([]);
        setRequirements([]);
        setBenefits([]);
      }
    } catch (err) {
      console.log(err);
      setError("Network or server error.");
      // Optionally, reset the data on error
      setDescription("No description found for this job title.");
      setResponsibilities([]);
      setRequirements([]);
      setBenefits([]);
    }
  };

  return (
    <div>
      <h1>AI Job Description Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter Job Title"
      />
      <button onClick={generateContent}>Generate Description</button>

      {/* Job Description Section */}
      <h3>Job Description</h3>
      <textarea
        value={description}
        readOnly
        rows={4}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      {/* Responsibilities Section */}
      <h3>Key Responsibilities</h3>
      <textarea
        value={responsibilities.join("\n")}
        readOnly
        rows={4}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      {/* Requirements Section */}
      <h3>Requirements</h3>
      <textarea
        value={requirements.join("\n")}
        readOnly
        rows={4}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      {/* Benefits Section */}
      <h3>Benefits</h3>
      <textarea
        value={benefits.join("\n")}
        readOnly
        rows={4}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default JobDescription;
