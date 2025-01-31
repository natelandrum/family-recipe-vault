"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } else {
      setStatus("Failed to send message.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-6 py-10 dark:bg-gray-900 dark:text-white"
    >
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Have questions? Reach out to us using the form below.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <label className="block font-medium text-gray-700 dark:text-gray-300">Your Name</label>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          required
        />
        </div>
        <div>
        <label className="block font-medium text-gray-700 dark:text-gray-300">Your Email</label>
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          required
        />
        </div>

        <div>
        <label className="block font-medium text-gray-700 dark:text-gray-300">Your Message</label>
        <textarea
          name="message"
          rows={4}
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          required
        />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[var(--color-dark)] hover:bg-[var(--color-accent)] text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
        >
        Send Message
        </motion.button>
        
      </form>
      {status && <p className="mt-3 text-center">{status}</p>}
      
      <div className="mt-8 flex justify-center space-x-6">
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-2xl text-blue-700 hover:text-blue-500 transition" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-2xl text-blue-400 hover:text-blue-300 transition" />
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-2xl text-gray-800 dark:text-white hover:text-gray-600 transition" />
        </a>
      </div>
    </motion.div>
    
      
    </div>
  );
}
