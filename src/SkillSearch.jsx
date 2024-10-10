import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function SkillSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newSkill, setNewSkill] = useState(""); // To hold new skill input value

  const [ID, setID] = useState("");
  const queryClient = useQueryClient(); // To invalidate and refetch queries

  // Fetch skills from the backend API based on search term
  const fetchSkills = async (searchTerm) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/search/?skill_name=${encodeURIComponent(
          searchTerm
        )}`
      );

      if (!response.data) {
        throw new Error("No data received");
      }

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch skills");
    }
  };

  // Query to fetch skills based on the search term
  const {
    isLoading,
    isError,
    data: skills,
    error,
    refetch,
  } = useQuery({
    queryKey: ["skills", searchTerm], // React Query will re-fetch when the search term changes
    queryFn: () => fetchSkills(searchTerm),
    enabled: !!searchTerm, // Only fetch if searchTerm exists
  });

  const addSkillMutation = useMutation({
    mutationFn: (values) => {
      return axios.post(`http://127.0.0.1:8000/addskill/`, {
        skill_name: values.skill,
        skill_id: values.id,
      });
    },
    onSuccess: (data) => {
      alert("Skill added successfully");
      queryClient.invalidateQueries(["skills", searchTerm]); // Refetch skills after adding
    },
    onError: (error) => {
      alert("Skill addition failed");
      console.log(error);
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: (values) => {
      console.log("values", values);
      return axios.delete(`http://127.0.0.1:8000/delete_skill/${values}/`);
    },
    onSuccess: (data) => {
      alert("Skill added successfully");
      queryClient.invalidateQueries(["skills", searchTerm]); // Refetch skills after adding
    },
    onError: (error) => {
      //   alert("Skill addition failed");
      console.log(error);
    },
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      refetch(); // Manually refetch the data
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      console.log("object", newSkill);
      addSkillMutation.mutate({ skill: newSkill, id: ID }); // Trigger add skill mutation
      setNewSkill("");
    }
  };

  // Handle deleting a skill
  const handleDeleteSkill = (skillId) => {
    deleteSkillMutation.mutate(skillId); // Trigger delete skill mutation
  };

  return (
    <div>
      <h1>Skill Search</h1>

      {/* Input for the skill search */}
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a skill..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Input for adding a new skill */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a new skill..."
        />
        <input
          type="text"
          value={ID}
          onChange={(e) => setID(e.target.value)}
          placeholder="Add a new skill..."
        />
        <button onClick={handleAddSkill}>Add Skill</button>
      </div>

      {/* Show loading state */}
      {isLoading && <p>Loading...</p>}

      {/* Show error message if something goes wrong */}
      {isError && <p>Error fetching search results: {error.message}</p>}

      {/* Conditionally render the table if skills are available */}
      {skills && skills.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Skill ID</th>
              <th>Skill Name</th>
              <th>Distance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, index) => (
              <tr key={index}>
                <td>{skill.skill_id}</td>
                <td>{skill.skill_name}</td>
                <td>{skill.distance.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleDeleteSkill(skill.skill_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Show a message when there are no results */}
      {!isLoading && skills && skills.length === 0 && searchTerm && (
        <p>No skills found for "{searchTerm}".</p>
      )}
    </div>
  );
}
