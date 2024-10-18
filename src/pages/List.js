import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './List.css';

const List = ({ selectedItems, setSelectedItems }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const totalPages = 150;
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://api.kcisa.kr/openapi/API_TOU_052/request?serviceKey=8b023383-2375-4dd2-a484-a4ad2cbcecb2&numOfRows=${totalPages}&pageNo=1`
        );
        setData(response.data.response.body.items.item);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  // 데이터 검색 필터링
  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (item) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter(i => i !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  // "리스트에 추가" 버튼 클릭 시
  const handleAddToFavorite = () => {
    alert("리스트에 추가되었습니다.");
  };

  // 항목 삭제 핸들러
  const handleDeleteItem = (item) => {
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.filter(selected => selected !== item)
    );
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="layout">
      <div className="sidebar">
        <Link to="/" className="sidebar-button home-button">
          Main Page
        </Link>
        <Link to="/create" className="sidebar-button large-button">
          음식점 추가
        </Link>
        <Link to="/favorite" className="sidebar-button small-button">
          Go to List
        </Link>
      </div>

      <div className="main-content">
        <h1>맛집 리스트</h1>

        <div className="search-add-container">
          <button className="add-to-favorite-button" onClick={handleAddToFavorite}>
            리스트에 추가
          </button>

          <input
            type="text"
            className="search-bar-list"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredData.length > 0 ? (
          <div className="card-container">
            {filteredData.map((item, index) => (
              <div className="card" key={index}>
                <input
                  type="checkbox"
                  className="card-checkbox"
                  onChange={() => handleCheckboxChange(item)}
                />
                <h2>{item.title}</h2>
                <p><strong>주소:</strong> {item.address}</p>
                <p><strong>전화번호:</strong> {item.tel}</p>
                <button className="delete-button" onClick={() => handleDeleteItem(item)}>
                  삭제
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default List;
