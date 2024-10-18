import React from 'react';
import { Link } from 'react-router-dom';
import './Favorite.css'; // Favorite.css에 사이드바 스타일 추가

const Favorite = ({ selectedItems, setSelectedItems }) => {
  // 항목 삭제 핸들러
  const handleDeleteItem = (item) => {
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.filter(selected => selected !== item)
    );
  };

  return (
    <div className="layout">
      {/* 사이드바 추가 */}
      <div className="sidebar">
        <Link to="/" className="sidebar-button home-button">
          Home Page
        </Link>
        <Link to="/list" className="sidebar-button small-button">
          List
        </Link>
      </div>

      <div className="main-content">
        <h1>내가 선택한 맛집</h1>
        {selectedItems.length > 0 ? (
          <div className="card-container">
            {selectedItems.map((item, index) => (
              <div className="card" key={index}>
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
          <p>선택된 맛집이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Favorite;
