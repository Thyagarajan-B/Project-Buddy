import { useEffect, useState } from "react";
import axios from "axios";

const GetMyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/projects/my-projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data.projects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    getProjects();
  }, []);

  const handleAction = async (projectId, applicantId, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/projects/${projectId}/applicants/${applicantId}`,
        { status: action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProjects(prevProjects =>
        prevProjects.map(project => {
          if (project._id === projectId) {
            return {
              ...project,
              applicants: project.applicants.map(applicant => {
                if (applicant._id === applicantId) {
                  return { ...applicant, status: action };
                }
                return applicant;
              }),
            };
          }
          return project;
        })
      );
    } catch (error) {
      console.error("Error updating applicant:", error);
    }
  };



  if (loading) return <div className="p-6 text-center">Loading your projects...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>
      {projects.length === 0 ? (
        <p>You haven't posted any projects yet.</p>
      ) : (
        projects.map((project) => (
          <div key={project._id} className="mb-8 p-5 border rounded-lg shadow">
            <h2 className="text-xl font-semibold text-blue-600">{project.title}</h2>
            <p className="text-gray-700">{project.description}</p>

            <h3 className="mt-4 font-medium text-gray-800">Applicants:</h3>
            {project.applicants.length === 0 ? (
              <p className="text-sm text-gray-500">No applicants yet.</p>
            ) : (
              project.applicants.map((applicant) => (
                <div key={applicant._id} className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p><strong>Name:</strong> {applicant.user?.name}</p>
                  <p><strong>Email:</strong> {applicant.user?.email}</p>
                  <p><strong>Message:</strong> {applicant.message}</p>
                  <p><strong>Portfolio:</strong>{" "}
                    <a href={applicant.portfolio} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                      {applicant.portfolio}
                    </a>
                  </p>
                  <p><strong>Status:</strong>{" "}
                    <span className={`font-semibold ${applicant.status === 'accepted' ? 'text-green-600' : applicant.status === 'rejected' ? 'text-red-600' : 'text-gray-600'}`}>
                      {applicant.status}
                    </span>
                  </p>

                  {applicant.status === 'pending' && (
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => handleAction(project._id, applicant.user._id, "accepted")}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(project._id, applicant.user._id, "rejected")}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                      >
                        Reject
                      </button>

                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GetMyProjects;
