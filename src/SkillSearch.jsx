import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function SkillSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newSkill, setNewSkill] = useState(""); // To hold new skill input value
  const [ID, setID] = useState("");
  const [loading, setLoading] = useState(false); // Loader state

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
      return axios.post(`http://127.0.0.1:8000/search/`, {
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
      setLoading(true);
      console.log("values", values);
      return axios.delete(`http://127.0.0.1:8000/search/${values}/`);
    },
    onSuccess: (data) => {
      setLoading(false);
      alert("Skill deleted successfully");
      queryClient.invalidateQueries(["skills", searchTerm]); // Refetch skills after deleting
    },
    onError: (error) => {
      setLoading(false);
      alert("Skill deletion failed");
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
      addSkillMutation.mutate({ skill: newSkill, id: ID }); // Trigger add skill mutation
      setNewSkill("");
    }
  };

  // Handle deleting a skill
  const handleDeleteSkill = (skillId) => {
    deleteSkillMutation.mutate(skillId); // Trigger delete skill mutation
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Skill Search</h1>

      {/* Input for the skill search */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a skill..."
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      {/* Input for adding a new skill */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a new skill..."
          style={styles.input}
        />
        <input
          type="text"
          value={ID}
          onChange={(e) => setID(e.target.value)}
          placeholder="Skill ID"
          style={styles.input}
        />
        <button onClick={handleAddSkill} style={styles.button}>
          Add Skill
        </button>
      </div>

      {/* Show loading state */}
      {isLoading && <div style={styles.loader}></div>}
      {loading && <div style={styles.loader}></div>}

      {/* Show error message if something goes wrong */}
      {isError && <p style={styles.error}>Error: {error.message}</p>}

      {/* Conditionally render the table if skills are available */}
      {!loading && skills && skills.length > 0 && (
        <table style={styles.table}>
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
              <tr key={index} style={styles.tableRow}>
                <td>{skill.skill_id}</td>
                <td>{skill.skill_name}</td>
                <td>{skill.distance.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => handleDeleteSkill(skill.skill_id)}
                    disabled={deleteSkillMutation.isLoading}
                    style={styles.deleteButton}
                  >
                    {deleteSkillMutation.isLoading ? "Deleting..." : "Delete"}
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

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  loader: {
    width: "40px",
    height: "40px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "20px auto",
  },
  error: {
    color: "#f44336",
    textAlign: "center",
    marginTop: "20px",
  },
};
