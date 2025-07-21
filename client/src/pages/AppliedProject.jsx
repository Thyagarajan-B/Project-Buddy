import { useEffect, useState, useContext } from 'react';
import axios from 'axios';

const AppliedProjects = () => {
    const [appliedProjects, setAppliedProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppliedProjects = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await axios.get('http://localhost:3000/api/projects/applied', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAppliedProjects(res.data.projects);
            } catch (err) {
                console.error("Error fetching applied projects:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppliedProjects();
    }, []);

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (!appliedProjects || appliedProjects.length === 0)
        return <div className="text-center mt-8">No applied projects found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Projects You Applied To</h2>
            {appliedProjects.map((project) => (
                <div key={project._id} className="border p-4 rounded-lg mb-4 shadow">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <p className="text-gray-700 mb-2">{project.description}</p>
                    <p className="text-sm text-gray-500">Status:
                        <span className={`ml-2   font-bold ${project.status === 'accepted' ? 'text-green-600' :
                                project.status === 'rejected' ? 'text-red-600' :
                                    'text-yellow-600'
                            }`}>
                            {project.status}
                        </span>
                    </p>
                </div>
            ))}
        </div>
    );
};

export default AppliedProjects;
