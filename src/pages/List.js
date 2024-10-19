import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button } from 'react-bootstrap';
import './List.css';

const List = ({ selectedItems, setSelectedItems }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockResponse = await axios.get('https://67123da04eca2acdb5f7bcce.mockapi.io/api/restaurants');
        
        if (mockResponse.data.length === 0) {
          const response = await axios.get(
            `http://api.kcisa.kr/openapi/API_TOU_052/request?serviceKey=8b023383-2375-4dd2-a484-a4ad2cbcecb2&numOfRows=150&pageNo=1`
          );
          await syncData(response.data.response.body.items.item);
          const newMockResponse = await axios.get('https://67123da04eca2acdb5f7bcce.mockapi.io/api/restaurants');
          setData(newMockResponse.data);
        } else {
          setData(mockResponse.data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const syncData = async (items) => {
    try {
      await Promise.all(items.map(item => 
        axios.post('https://67123da04eca2acdb5f7bcce.mockapi.io/api/restaurants', {
          title: item.title,
          address: item.address,
          tel: item.tel,
        })
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckboxChange = (item) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter(i => i !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  const handleDeleteItem = (itemToDelete) => {
    const updatedData = data.filter(item => item !== itemToDelete);
    setData(updatedData);
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.filter(item => item !== itemToDelete)
    );
  };

  const handleAddToFavorites = async () => {
    if (selectedItems.length > 0) {
      try {
        const favoritesResponse = await axios.get('https://67123da04eca2acdb5f7bcce.mockapi.io/api/favorites');
        const existingFavorites = favoritesResponse.data;
  
        const hasDuplicates = selectedItems.some(item => 
          existingFavorites.some(favorite => 
            favorite.title === item.title && favorite.address === item.address
          )
        );
  
        if (hasDuplicates) {
          alert('선택한 목록에 이미 즐겨찾기에 추가된 맛집이 있습니다. 추가할 수 없습니다.');
          return; // 중복이 있을 경우 추가하지 않음
        }
  
        await Promise.all(selectedItems.map(async (item) => {
          await axios.post('https://67123da04eca2acdb5f7bcce.mockapi.io/api/favorites', {
            title: item.title,
            address: item.address,
            tel: item.tel,
          });
        }));
  
        alert('선택한 맛집이 즐겨찾기에 추가되었습니다.');
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('선택된 맛집이 없습니다.');
    }
  };
   
  const handlePageChange = (direction) => {
    setCurrentPage(prevPage => {
      if (direction === 'next') {
        return prevPage + 1;
      } else if (direction === 'prev' && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="layout">
      <div className="sidebar">
        <Link to="/" className="sidebar-button home-button">Home Page</Link>
        <Link to="/favorite" className="sidebar-button small-button">Favorite</Link>
        <Link to="/create" className="sidebar-button large-button">음식점 추가</Link>
      </div>

      <div className="main-content">
        <h1>맛집 리스트</h1>

        <div className="search-add-container">
          <Button className="add-to-favorite-button" onClick={handleAddToFavorites}>
            즐겨찾기에 추가
          </Button>

          <input
            type="text"
            className="search-bar-list"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="pagination">
            <Button
              className="page-button"
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
            >
              {'<'}
            </Button>
            <Button
              className="page-button"
              onClick={() => handlePageChange('next')}
              disabled={currentPage * itemsPerPage >= filteredData.length}
            >
              {'>'}
            </Button>
          </div>
        </div>

        <div className="pagination-info">
          {`Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredData.length)} of ${filteredData.length}`}
        </div>

        <Row className="card-container" style={{ marginTop: '20px' }}>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <Col key={index} md={12}>
                <Card className="restaurant-card">
                  <Card.Body className="card-body">
                    <div className="card-content">
                      <input
                        type="checkbox"
                        className="card-checkbox"
                        onChange={() => handleCheckboxChange(item)}
                        checked={selectedItems.includes(item)}
                      />
                      <div>
                        <Card.Title className="card-title">{item.title}</Card.Title>
                        <Card.Text className="card-text">
                          <strong>주소:</strong> {item.address} <br />
                          <strong>전화번호:</strong> {item.tel}
                        </Card.Text>
                      </div>
                    </div>
                    <Button className="delete-button" onClick={() => handleDeleteItem(item)}>
                      삭제
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </Row>
      </div>
    </div>
  );
};

export default List;
