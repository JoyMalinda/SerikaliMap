import React from "react";

export default function ErrorPage({ message }) {
  return (
    <div className="flex justify-center items-center h-screen w-auto flex-col gap-4 dark:bg-gray-900 bg-gray-100 p-4">
      <div className="text-center text-red-500 border p-6 rounded-lg border-red-500 bg-red-500/20 min-w-100">
       <p className="font-bold text-3xl">Error:</p>
       <p className="text-xl pt-2">{message}</p>
       <p className="text-xl">Please try again later.</p>
      </div>
      <a href="/" className="text-blue-500 hover:underline">Back to Home Page &gt;</a>
    </div>
    );
}