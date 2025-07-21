import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ApplyProject = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth();

  const [portfolio, setPortfolio] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/api/projects/${id}/apply`, {
        portfolio,
        message,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Application submitted!");
      navigate("/explore-projects");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-4">Apply for Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={user?.name || ""}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-medium">Portfolio Link</label>
          <input
            type="url"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Why do you want to join?</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyProject;
