import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Favorite.css';

const Favorite = ({ selectedItems, setSelectedItems }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('https://67123da04eca2acdb5f7bcce.mockapi.io/api/favorites');
        setFavorites(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleDeleteItem = async (item) => {
    try {
      await axios.delete(`https://67123da04eca2acdb5f7bcce.mockapi.io/api/favorites/${item.id}`);
      setFavorites(prevFavorites => prevFavorites.filter(favorite => favorite.id !== item.id));
      setSelectedItems(prevSelectedItems =>
        prevSelectedItems.filter(selected => selected.id !== item.id)
      );
    } catch (err) {
      console.error('삭제 중 오류 발생:', err);
      alert('맛집 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="layout">
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
        {favorites.length > 0 ? (
          <div className="container-favorite">
            {favorites.map((item, index) => (
              <div className="card" key={index}>
                <h2>{item.title}</h2>
                <p><strong>나라:</strong> {item.category2}</p>
                <p><strong>전화번호:</strong> {item.tel}</p>
                <p><strong>주소:</strong> {item.address}</p>
                <p><strong>정보:</strong> {item.information}</p>
                <p><strong>운영시간:</strong> {item.operatingTime}</p>
                <p><strong>좌표:</strong> {item.coordinates}</p>
                <button className="delete-button" onClick={() => handleDeleteItem(item)}>
                  삭제
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>즐겨찾기가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Favorite;
