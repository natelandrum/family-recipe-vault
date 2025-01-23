import React from "react";
import { FaClipboardList, FaUsers, FaLock } from "react-icons/fa";

const features = [
  {
    icon: <FaClipboardList className="text-5xl text-red-500" />,
    title: "Organize Your Recipes",
    description:
      "Easily categorize and manage your family’s treasured recipes in one secure place.",
  },
  {
    icon: <FaUsers className="text-5xl text-green-500" />,
    title: "Share with Family",
    description:
      "Invite family members to collaborate and share their favorite recipes effortlessly.",
  },
  {
    icon: <FaLock className="text-5xl text-blue-500" />,
    title: "Secure Your Memories",
    description:
      "Keep your cherished recipes safe with secure cloud storage and backup options.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50 text-center">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Why Choose <span className="text-red-500">Family Recipe Vault</span>?
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="mt-4 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
