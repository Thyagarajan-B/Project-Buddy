import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div id="contact" className="py-16 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center mb-10 text-indigo-800">Contact Us</h2>
      <motion.div
        className="max-w-3xl mx-auto bg-slate-100 p-8 rounded-2xl shadow-md"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <form className="grid grid-cols-1 gap-6">
          <input
            type="text"
            placeholder="Your Name"
            className="p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <textarea
            rows="4"
            placeholder="Your Message"
            className="p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow transition duration-300"
          >
            Send Message
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
