import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn more about our team and what we do.",
};

export default function AboutPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
                    About Us
                </h1>
                <p className="text-center text-gray-600 mb-4">
                    We are a team of developers working to make the world a better place.
                </p>
            </div>
        </div>
    );
}