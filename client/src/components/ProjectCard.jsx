import React from 'react'

const ProjectCard = ({ project }) => {
    return (
        <div className="bg-white shadow-md p-4 rounded-lg w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold">{project.title}</h2>
            <p className="text-gray-600 mt-1">{project.description}</p>
            <p className="text-sm text-gray-500 mt-2">Posted by: {project.createdByName}</p>
            {/* <p className="text-sm text-gray-500 mt-2">Team Size: {project.teamSize}</p> */}
            <button className="mt-3 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                View Details
            </button>
        </div>
    )
}

export default ProjectCard
