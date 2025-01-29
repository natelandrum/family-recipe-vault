import Link from 'next/link';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <SentimentDissatisfiedIcon className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">404 Not Found</h2>
        <p className="text-gray-600 mb-6">
          Sorry, we could not find the recipe you were looking for.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-400 transition duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
}
