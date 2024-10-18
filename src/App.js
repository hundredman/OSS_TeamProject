import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import List from './pages/List'; // List 컴포넌트 임포트
import Create from './pages/Create'; // Create 컴포넌트 임포트
import Favorite from './pages/Favorite'; // Favorite 컴포넌트 임포트

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} /> {/* List 컴포넌트 경로 */}
        <Route path="/create" element={<Create />} /> {/* Create 컴포넌트 경로 */}
        <Route path="/favorite" element={<Favorite />} /> {/* Favorite 컴포넌트 경로 */}
        <Route path="/search" element={<List />} /> {/* 검색용 경로, List 컴포넌트를 사용 */}
      </Routes>
    </Router>
  );
}

export default App;
