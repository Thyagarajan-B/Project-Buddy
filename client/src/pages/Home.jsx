import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  const [text, setText] = useState('');
  const fullText = 'Connect with passionate developers, share your ideas, and build something amazing—together.';
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText.charAt(index));
        setIndex(prev => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <div className="bg-white text-indigo-900">

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          <span className="text-indigo-800">Project Buddy</span>
          <span className="block text-indigo-500 text-2xl md:text-3xl mt-3 font-medium">
            Because Building Alone is Boring
          </span>
        </h1>

        <p className="text-base md:text-lg text-gray-700 font-medium max-w-2xl mb-6">
          {text}
          <span className="animate-pulse">|</span>
        </p>

        <Link to="/register">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md transition duration-300">
            Get Started for Free
          </button>
        </Link>
      </section>


      {/* ABOUT SECTION */}
      <section className="py-20 bg-slate-100" id="about">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-indigo-800">About Project Buddy</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Project Buddy is a platform where developers unite to share ideas, form teams, and build real-world projects. Whether you're a beginner or a pro, there's someone ready to build with you!
            </p>
          </div>
          <div className="flex justify-center">
            <img src="https://i.pinimg.com/736x/2e/c7/37/2ec737007f23e6b61200e7ef17d43092.jpg" alt="Teamwork" width={350} className=" max-w-md rounded-xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 bg-white" id="features">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-12">Platform Features</h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-indigo-50 hover:bg-indigo-100 p-6 rounded-2xl shadow transition duration-300"
            >
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Contact />
      <Footer />
    </div>
  );
};

const features = [
  {
    title: "Post Project Ideas",
    description: "Share your unique ideas and attract collaborators to bring them to life.",
  },
  {
    title: "Join Projects",
    description: "Apply to existing projects that excite you and become part of a team.",
  },
  {
    title: "Manage Your Team",
    description: "Accept or reject applications, assign roles, and collaborate with your team efficiently.",
  },
  {
    title: "Profile & Portfolio",
    description: "Showcase your skills and past work to increase your chances of collaboration.",
  },
  {
    title: "View Created Projects",
    description: "Easily see and manage all the projects you've created in one place.",
  },
  {
    title: "Remove Applicant",
    description: "Remove any team member or applicant if they're no longer a good fit.",
  },
  {
    title: "Edit Projects Anytime",
    description: "Update your project details whenever your vision evolves.",
  },
  {
    title: "Accept / Reject Applicants",
    description: "Select the best teammates by reviewing their applications thoroughly.",
  },
  {
    title: "Leave Project Requests",
    description: "Let collaborators request to leave so you can manage the team efficiently.",
  },
];

export default Home;
