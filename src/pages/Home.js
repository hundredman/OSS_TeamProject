import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery) {
      navigate(`/list?search=${encodeURIComponent(searchQuery)}`); // 검색어를 쿼리 파라미터로 전달
    } else {
      alert('검색어를 입력해주세요.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="home-container">
      <div className="header">
        <button
          onClick={() => navigate('/list')} // 쿼리 없이 List.js로 이동
          className="navigate-button"
        >
          List
        </button>
        <button className="navigate-button" onClick={() => navigate('/favorite')}>
          Favorite
        </button>
      </div>
      <img
        src="https://cdn.pixabay.com/photo/2018/05/21/12/37/restaurant-3418134_1280.png"
        alt="Google logo"
        className="google-logo"
      />
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress} // Enter 키 입력 처리
          className="search-bar"
          placeholder="Search for a restaurant"
        />
        <div className="button-container">
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
