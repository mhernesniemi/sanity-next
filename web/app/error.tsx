"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-zinc-900">
        <h1 className="text-3xl font-semibold mb-8 text-black dark:text-zinc-50">
          Something went wrong!
        </h1>
        <p className="text-lg text-red-600 dark:text-red-400 mb-4">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try again
        </button>
      </main>
    </div>
  );
}
