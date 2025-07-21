import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bio: "",
        socialLinks: {
            linkedin: "",
            github: "",
            portfolio: ""
        }
    });

    useEffect(() => {
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }, [file]);

    useEffect(() => {
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }, [file]);

    useEffect(() => {
        const localUser = localStorage.getItem("user");
        if (localUser) {
            console.log(localUser)
            const parsed = JSON.parse(localUser);
            console.log(parsed, "Parsed")
            setUser(parsed);
            setFormData({
                name: parsed.name || "",
                email: parsed.email || "",
                bio: parsed.bio || "",
                socialLinks: parsed.socialLinks || {
                    linkedin: "",
                    github: "",
                    portfolio: ""
                }
            });
        } else {
            const fetchUser = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get("http://localhost:3000/api/user/profile", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(res.data);
                    localStorage.setItem("user", JSON.stringify(res.data));
                    setFormData({
                        name: res.data.name || "",
                        email: res.data.email || "",
                        bio: res.data.bio || "",
                        socialLinks: res.data.socialLinks || {
                            linkedin: "",
                            github: "",
                            portfolio: ""
                        }
                    });
                } catch (err) {
                    console.error("Failed to fetch user:", err);
                }
            };
            fetchUser();
        }
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        const formDataUpload = new FormData();
        formDataUpload.append("profilePic", file);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.put("http://localhost:3000/api/user/update-profile-pic", formDataUpload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            setFile(null);
            alert("Profile picture updated!");
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Failed to upload.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("socialLinks.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdateDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put("http://localhost:3000/api/user/update-details", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            setEditing(false);
            alert("Details updated!");
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update details.");
        }
    };

    if (!user) return <p className="text-center mt-6 text-lg text-gray-600">Loading profile...</p>;

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-2xl rounded-2xl mt-10">
            <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                    <img
                        src={
                            preview ||
                            (user?.profilePic
                                ? `http://localhost:3000${user.profilePic}`
                                : "https://via.placeholder.com/150")
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4"
                    />
                    {/* <img
                        src={
                            user?.profilePic
                                ? `http://localhost:3000${user.profilePic}`
                                : "https://via.placeholder.com/150"
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4"
                    /> */}

                </div>

                <label className="relative inline-flex items-center justify-center bg-indigo-600 text-white font-semibold px-5 py-2 rounded-md shadow-md hover:bg-indigo-700 transition cursor-pointer">
                    Change Picture
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </label>

                {file && (
                    <button
                        onClick={handleUpload}
                        className="mt-3 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 shadow cursor-pointer"
                    >
                        Upload
                    </button>
                )}
            </div>

            <div className="mt-8">
                {!editing ? (
                    <div className="space-y-4 text-gray-800">
                        <h2 className="text-2xl font-semibold text-center mb-6">Profile Info</h2>
                        <div><strong>Name:</strong> {user.name}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        {user.socialLinks?.linkedin && (
                            <div><strong>LinkedIn:</strong> <a className="text-blue-500 underline" href={user.socialLinks.linkedin}>{user.socialLinks.linkedin}</a></div>
                        )}
                        {user.socialLinks?.github && (
                            <div><strong>GitHub:</strong> <a className="text-blue-500 underline" href={user.socialLinks.github}>{user.socialLinks.github}</a></div>
                        )}
                        {user.socialLinks?.portfolio && (
                            <div><strong>Portfolio:</strong> <a className="text-blue-500 underline" href={user.socialLinks.portfolio}>{user.socialLinks.portfolio}</a></div>
                        )}
                        <div className="text-center mt-6">
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition cursor-pointer"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 space-y-5">
                        <h2 className="text-2xl font-semibold text-center text-indigo-700">Edit Your Details</h2>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Name"
                            className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <input
                            type="text"
                            name="socialLinks.linkedin"
                            value={formData.socialLinks.linkedin || ""}
                            onChange={handleInputChange}
                            placeholder="LinkedIn URL"
                            className="w-full border p-3 rounded-md"
                        />
                        <input
                            type="text"
                            name="socialLinks.github"
                            value={formData.socialLinks.github || ""}
                            onChange={handleInputChange}
                            placeholder="GitHub URL"
                            className="w-full border p-3 rounded-md"
                        />
                        <input
                            type="text"
                            name="socialLinks.portfolio"
                            value={formData.socialLinks.portfolio || ""}
                            onChange={handleInputChange}
                            placeholder="Portfolio Website"
                            className="w-full border p-3 rounded-md"
                        />

                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={handleUpdateDetails}
                                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 cursor-pointer"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditing(false)}
                                className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
