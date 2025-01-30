"use client";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-6 py-10 dark:bg-gray-900 dark:text-white"
    >
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-700 dark:text-gray-300">
        This Privacy Policy explains how we collect, use, and protect your personal data when you use our services.
        By accessing our website, you agree to the collection and use of information in accordance with this policy.
      </p>

      <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
      <p className="text-gray-600 dark:text-gray-400">
        We collect the following types of information when you interact with our website:
      </p>
      <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
        <li>Personal Information (Name, Email, Contact Details)</li>
        <li>Usage Data (IP Address, Browser Type, Access Time, Pages Visited)</li>
        <li>Cookies and Tracking Technologies</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
      <p className="text-gray-600 dark:text-gray-400">
        We use the collected information to:
      </p>
      <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
        <li>Provide and maintain our services</li>
        <li>Improve user experience and website performance</li>
        <li>Respond to customer inquiries and provide support</li>
        <li>Ensure security and prevent fraud</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">3. Data Sharing and Security</h2>
      <p className="text-gray-600 dark:text-gray-400">
        We do not sell or share your personal data with third parties without your consent, except when required by law.
        We implement strict security measures to protect your information from unauthorized access.
      </p>

      <h2 className="text-2xl font-semibold mt-6">4. Cookies and Tracking Technologies</h2>
      <p className="text-gray-600 dark:text-gray-400">
        We use cookies to enhance user experience and analyze website traffic.
        You can manage your cookie preferences in your browser settings.
      </p>

      <h2 className="text-2xl font-semibold mt-6">5. Changes to This Privacy Policy</h2>
      <p className="text-gray-600 dark:text-gray-400">
        We may update this policy from time to time.
        Any changes will be posted on this page, and you will be notified via email if necessary.
      </p>

      <h2 className="text-2xl font-semibold mt-6">6. Contact Us</h2>
      <p className="text-gray-600 dark:text-gray-400">
        If you have any questions about this Privacy Policy, you can contact us at:
      </p>
      <p className="text-blue-500 underline">support@familyrecipevault.com</p>
    </motion.div>
  );
}
