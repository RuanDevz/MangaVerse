import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Flame, Heart, Sparkles } from 'lucide-react';

const categories = [
  { id: 'manga', label: 'Manga', icon: BookOpen },
  { id: 'manhwa', label: 'Manhwa', icon: Sparkles },
  { id: 'yaoi', label: 'Yaoi', icon: Heart },
  { id: 'hentai', label: 'Hentai', icon: Flame, nsfw: true },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen fixed left-0 top-16 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Categories</h2>
        <nav className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <category.icon className="w-5 h-5" />
              <span>{category.label}</span>
              {category.nsfw && (
                <span className="text-xs font-medium text-red-500 ml-auto">18+</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}