import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
const JobDescription = () => {
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [error, setError] = useState("");

  // getting job details from api made for gemini

  const getJobDetailsMutation = useMutation({
    mutationFn: (values) => {
      console.log("mss", values);
      const protocol = window.location.protocol;

      return axios.post(`https://9934ace31540.ngrok.app/api/jobs/ai-content`, {
        job_title: values,
      });
    },
    onSuccess: (data) => {
      console.log("data", data);
      setDescription(data.data.description || "");
      setResponsibilities(data.data.responsibilities || "");
      setRequirements(data.data.requirements || "");
      setBenefits(data.data.benefits || "");
      setError("");
    },
    onError: (error) => {
      setDescription("No description found for this job title.");
      setResponsibilities("");
      setRequirements("");
      setBenefits("");
      console.log(error);
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
    </div>
  );
};

export default JobDescription;
