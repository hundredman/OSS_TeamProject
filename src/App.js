import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import List from './pages/List';
import Create from './pages/Create';
import Favorite from './pages/Favorite';
import Edit from './pages/Edit'; 

function App() {
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/list"
          element={<List selectedItems={selectedItems} setSelectedItems={setSelectedItems} />}
        />
        <Route path="/create" element={<Create />} />
        <Route
          path="/favorite"
          element={<Favorite selectedItems={selectedItems} setSelectedItems={setSelectedItems} />}
        />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>
    </Router>
  );
}

export default App;
