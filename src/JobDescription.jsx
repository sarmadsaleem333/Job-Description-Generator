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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loader state

  // getting job details from api made for gemini

  const getJobDetailsMutation = useMutation({
    mutationFn: (values) => {
      const protocol = window.location.protocol;
      setLoading(true); // Show loader when the request starts

      return axios.post(`https://9934ace31540.ngrok.app/api/jobs/ai-content`, {
        job_title: values,
      });
    },
    onSuccess: (data) => {
      setDescription(data.data.description || "");
      setResponsibilities(data.data.responsibilities || "");
      setRequirements(data.data.requirements || "");
      setBenefits(data.data.benefits || "");
      setError("");
      setLoading(false); // Hide loader when request completes
    },
    onError: (error) => {
      setDescription("No description found for this job title.");
      setResponsibilities("");
      setRequirements("");
      setBenefits("");
      setError("Something went wrong, please try again.");
      setLoading(false); // Hide loader on error
    },
  });

  const getJobDetails = async (values) => {
    await getJobDetailsMutation.mutate(values);
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
      <button onClick={() => getJobDetails(prompt)}>
        Generate Description
      </button>

      {loading ? ( // Show the loader when loading is true
        <Loader />
      ) : (
        <>
          {/* Job Description Section */}
          <h3>Job Description</h3>
          <ReactQuill
            value={description}
            readOnly
            theme="snow"
            style={{ marginBottom: "1rem" }}
          />

          {/* Responsibilities Section */}
          <h3>Key Responsibilities</h3>
          <ReactQuill
            value={responsibilities}
            readOnly
            theme="snow"
            style={{ marginBottom: "1rem" }}
          />

          {/* Requirements Section */}
          <h3>Requirements</h3>
          <ReactQuill
            value={requirements}
            readOnly
            theme="snow"
            style={{ marginBottom: "1rem" }}
          />

          {/* Benefits Section */}
          <h3>Benefits</h3>
          <ReactQuill
            value={benefits}
            readOnly
            theme="snow"
            style={{ marginBottom: "1rem" }}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
};

// Simple CSS for loader
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
