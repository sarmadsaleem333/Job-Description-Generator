import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Loader Component
const Loader = () => (
  <div className="loader">
    <div className="spinner"></div>
  </div>
);

const JobDescription = () => {
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [skills, setSkills] = useState([]); // Skill recommendations from the API
  const [selectedSkills, setSelectedSkills] = useState([]); // To store user's selected skills
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loader state
  const [isAIUsed, setIsAIUsed] = useState(false); // Track if AI is used for generation

  // getting job details from the API based on the user's input (dynamic API call)
  const getJobDetailsMutation = useMutation({
    mutationFn: (jobTitle) => {
      setLoading(true); // Show loader when the request starts
      return axios.get(
        `http://127.0.0.1:8000/recommend_skills/?job_title=${jobTitle}`,
        {}
      );
    },
    onSuccess: (data) => {
      setDescription(data.data.description || "");
      setResponsibilities(data.data.responsibilities || "");
      setRequirements(data.data.requirements || "");
      setBenefits(data.data.benefits || "");
      setSkills(data.data.skills || []); // Set skills recommendation from the API
      setError("");
      setIsAIUsed(true); // AI was used
      setLoading(false); // Hide loader when the request completes
    },
    onError: (error) => {
      setDescription("No description found for this job title.");
      setResponsibilities("");
      setRequirements("");
      setBenefits("");
      setSkills([]); // Reset skills on error
      setError("Something went wrong, please try again.");
      setLoading(false); // Hide loader on error
    },
  });

  const getJobDetails = async () => {
    if (prompt) {
      await getJobDetailsMutation.mutate(prompt); // Use dynamic job title from user input
    } else {
      setError("Please enter a job title.");
    }
  };

  const handleSkillSelection = (skill) => {
    if (selectedSkills.find((s) => s.skill_id === skill.skill_id)) {
      setSelectedSkills(
        selectedSkills.filter((s) => s.skill_id !== skill.skill_id)
      );
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = () => {
    const jobDetails = {
      title: prompt,
      description,
      responsibilities,
      requirements,
      benefits,
      skills: selectedSkills.map((skill) => ({
        skill_id: skill.skill_id,
        skill_name: skill.skill_name,
      })),
    };

    console.log("Submitting Job Details: ", jobDetails);
  };

  return (
    <div>
      <h1>AI Job Description Generator</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          <strong>Enter a Job Title:</strong>
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter Job Title"
        />
        <button onClick={getJobDetails}>Generate with AI</button>
      </div>

      {/* Display the loader */}
      {loading && <Loader />}
      <h3>Write Job Description</h3>

      <ReactQuill
        value={description}
        onChange={setDescription} // Make editable
        theme="snow"
        style={{ marginBottom: "1rem" }}
      />

      <h3>Key Responsibilities</h3>
      <ReactQuill
        value={responsibilities}
        onChange={setResponsibilities} // Make editable
        theme="snow"
        style={{ marginBottom: "1rem" }}
      />

      <h3>Requirements</h3>
      <ReactQuill
        value={requirements}
        onChange={setRequirements} // Make editable
        theme="snow"
        style={{ marginBottom: "1rem" }}
      />

      <h3>Benefits</h3>
      <ReactQuill
        value={benefits}
        onChange={setBenefits} // Make editable
        theme="snow"
        style={{ marginBottom: "1rem" }}
      />

      {/* Skill Recommendations */}
      <h3>Recommended Skills {isAIUsed && "(AI Recommendations)"}</h3>
      <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap" }}>
        {skills.length > 0 ? (
          skills.map((skill) => (
            <div
              key={skill.skill_id}
              onClick={() => handleSkillSelection(skill)}
              style={{
                padding: "0.5rem 1rem",
                margin: "0.5rem",
                borderRadius: "20px",
                backgroundColor: selectedSkills.find(
                  (s) => s.skill_id === skill.skill_id
                )
                  ? "#4CAF50"
                  : "#f0f0f0",
                cursor: "pointer",
                color: selectedSkills.find((s) => s.skill_id === skill.skill_id)
                  ? "#fff"
                  : "#000",
              }}
            >
              {skill.skill_name}
            </div>
          ))
        ) : (
          <p>No skill recommendations available.</p>
        )}
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit} style={{ marginTop: "1rem" }}>
        Submit Job
      </button>
    </div>
  );
};

// Loader CSS
const style = document.createElement("style");
style.innerHTML = `
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 1s ease infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default JobDescription;
