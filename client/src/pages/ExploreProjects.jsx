import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ExploreProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/projects/getallprojects");
        setProjects(res.data.projects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleApply = (projectId) => {
    navigate(`/apply/${projectId}`);
  };

  const handlePostProject = () => {
    navigate("/create-projects");
  };

  if (loading) return <div className="p-6 text-center">Loading projects...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePostProject}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Post Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => {
          const isCreator = project?.createdBy?._id === user?._id;
          const hasApplied = project?.applicants?.some(app => app.user === user?._id);
          const isTeamMember = project?.team?.includes(user?._id);
          const teamCount = project?.team?.length || 0;
          const spotsLeft = project?.teamSize - teamCount;
          const isFull = spotsLeft <= 0;

          let buttonLabel = "Apply";
          let isDisabled = false;

          if (isCreator) {
            buttonLabel = "You created this project";
            isDisabled = true;
          } else if (isTeamMember) {
            buttonLabel = "Team Member";
            isDisabled = true;
          } else if (hasApplied) {
            buttonLabel = "Applied";
            isDisabled = true;
          } else if (isFull) {
            buttonLabel = "Team Full";
            isDisabled = true;
          }

          return (
            <div key={project._id} className="bg-white shadow-md rounded-xl p-5 flex flex-col">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{project.title}</h3>
              <p className="text-gray-700 mb-2">{project.description}</p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Roles Needed:</strong> {project.rolesNeeded.join(", ")}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Team Size:</strong> {project.teamSize}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Accepted Members:</strong> {teamCount}
              </p>
              <p className={`text-sm mb-2 font-medium ${isFull ? "text-red-600" : "text-green-600"}`}>
                {isFull
                  ? "Team is Full"
                  : `Spots Left: ${spotsLeft} / ${project.teamSize}`}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Posted by:</strong> {project.createdBy?.email || "Unknown"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Posted on:</strong> {new Date(project.createdAt).toLocaleDateString()}
              </p>

              <button
                onClick={() => handleApply(project._id)}
                disabled={isDisabled}
                className={`mt-auto px-4 py-2 rounded transition font-semibold
                  ${isDisabled
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"}`}
              >
                {buttonLabel}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreProjects;
