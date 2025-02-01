import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

export function Admin() {
  const { user } = useAuthStore();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            User Statistics
          </h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              Total Users: <span className="font-medium">1,234</span>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Active Subscriptions: <span className="font-medium">789</span>
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Content Stats
          </h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              Total Manga: <span className="font-medium">5,678</span>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Chapters: <span className="font-medium">98,765</span>
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Revenue</h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              Monthly: <span className="font-medium">$12,345</span>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Annual: <span className="font-medium">$148,140</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}