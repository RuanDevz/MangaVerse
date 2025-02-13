import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { MangaDetail } from './pages/MangaDetail';
import { Subscription } from './pages/Subscription';
import { Admin } from './pages/Admin';
import { ChapterReader } from './pages/ChapterReader';
import { Popular } from './pages/Popular';
import { Latest } from './pages/Latest';
import { Favorites } from './pages/Favorites';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <Sidebar />
        <div className="pl-64">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/latest" element={<Latest />} />
            <Route path="/favorites" element={<Favorites />} />




            <Route path="/manga/:id" element={<MangaDetail />} />
            <Route path="/manga/:id/chapter/:chapterId" element={<ChapterReader />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App