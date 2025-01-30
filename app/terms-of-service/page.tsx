"use client";
import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-6 py-10 dark:bg-gray-900 dark:text-white"
    >
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-700 dark:text-gray-300">
        These Terms of Service govern your use of our website and services. By accessing or using our website, 
        you agree to comply with these terms.
      </p>

      <h2 className="text-2xl font-semibold mt-6">1. User Responsibilities</h2>
      <p className="text-gray-600 dark:text-gray-400">
        By using our service, you agree to:
      </p>
      <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
        <li>Provide accurate and complete information</li>
        <li>Use the website lawfully and ethically</li>
        <li>Not engage in hacking, scraping, or data theft</li>
        <li>Respect the intellectual property rights of others</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">2. Account Registration</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Some features may require account registration. You are responsible for safeguarding your account credentials.
        We are not liable for unauthorized account access due to negligence.
      </p>

      <h2 className="text-2xl font-semibold mt-6">3. Intellectual Property</h2>
      <p className="text-gray-600 dark:text-gray-400">
        All content, trademarks, and materials on our website are owned by us or licensed to us.
        You may not reproduce, distribute, or modify our content without permission.
      </p>

      <h2 className="text-2xl font-semibold mt-6">4. Termination of Services</h2>
      <p className="text-gray-600 dark:text-gray-400">
        We reserve the right to suspend or terminate your access to our services if you violate these terms.
        Such termination may occur without prior notice.
      </p>

      <h2 className="text-2xl font-semibold mt-6">5. Limitation of Liability</h2>
      <p className="text-gray-600 dark:text-gray-400">
        We are not responsible for any direct, indirect, or incidental damages resulting from your use of our services.
        Your use of our website is at your own risk.
      </p>

      <h2 className="text-2xl font-semibold mt-6">6. Governing Law</h2>
      <p className="text-gray-600 dark:text-gray-400">
        These terms shall be governed by and construed in accordance with the laws of [Your Country].
        Any disputes shall be resolved through arbitration or the appropriate courts.
      </p>

      <h2 className="text-2xl font-semibold mt-6">7. Changes to Terms</h2>
      <p className="text-gray-600 dark:text-gray-400">
        We may modify these Terms of Service at any time. Continued use of our services indicates your acceptance of the updated terms.
      </p>

      <h2 className="text-2xl font-semibold mt-6">8. Contact Us</h2>
      <p className="text-gray-600 dark:text-gray-400">
        If you have any questions regarding these terms, please contact us at:
      </p>
      <p className="text-blue-500 underline">support@familyrecipevault.com</p>
    </motion.div>
  );
}
