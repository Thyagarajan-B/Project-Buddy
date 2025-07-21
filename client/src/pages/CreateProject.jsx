import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [teamSize, setteamSize] = useState("");
    const [rolesNeeded, setRolesNeeded] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !rolesNeeded || !teamSize) {
            return setError("All fields are required.");
        }

        try {
            const token = localStorage.getItem("token");
            //   console.log(token)
            const res = await axios.post(
                "http://localhost:3000/api/projects/create",
                {
                    title,
                    description,
                    teamSize,
                    rolesNeeded: rolesNeeded.split(",").map((role) => role.trim()),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(res)
            if (res.data.success) {
                navigate("/explore-projects");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div>
            <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Post a New Project</h2>

                {error && <div className="text-red-600 mb-3 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Project Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border p-2 rounded-lg"
                    />
                    <textarea
                        placeholder="Project Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border p-2 rounded-lg h-28"
                    />
                    <input
                        type="number"
                        placeholder="Size of the Team in numbers."
                        value={teamSize}
                        onChange={(e) => setteamSize(e.target.value)}
                        className="w-full border p-2 rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="Roles Needed (comma-separated)"
                        value={rolesNeeded}
                        onChange={(e) => setRolesNeeded(e.target.value)}
                        className="w-full border p-2 rounded-lg"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                    >
                        Post Project
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;
