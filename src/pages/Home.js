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
      navigate(`/search/${searchQuery}`); // 검색어를 포함해 Search.js로 이동
    }
  };

  return (
    <div className="home-container">
      <div className="header">
        <button
          onClick={() => navigate('/list')} // 쿼리 없이 List.js로 이동
          className="navigate-button"
        >
          Go to Show
        </button>
      </div>
      <img
        src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
        alt="Google logo"
        className="google-logo"
      />
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
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
