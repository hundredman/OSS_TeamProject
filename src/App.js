import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import List from './pages/List'; // List 컴포넌트 임포트
import Search from './pages/Search'; // Search 컴포넌트 임포트

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/search/:searchTerm" element={<Search />} /> {/* 검색용 경로 */}
      </Routes>
    </Router>
  );
}

export default App;
