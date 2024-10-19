import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button } from 'react-bootstrap';
import './List.css';

const List = ({ selectedItems, setSelectedItems }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock API에서 데이터를 먼저 가져옴
        const mockResponse = await axios.get('https://67123da04eca2acdb5f7bcce.mockapi.io/api/restaurants');
        // Mock API에 데이터가 없는 경우에만 새로운 데이터를 API에서 가져옴
        if (mockResponse.data.length === 0) {
          const response = await axios.get(
            `http://api.kcisa.kr/openapi/API_TOU_052/request?serviceKey=8b023383-2375-4dd2-a484-a4ad2cbcecb2&numOfRows=80&pageNo=1`
          );

          // 새로운 데이터를 가져온 후 Mock API에 동기화하고 바로 setData 처리
          const newItems = response.data.response.body.items.item;
          await syncData(newItems);

          // 새로운 데이터를 setData로 업데이트 (다시 GET 요청 안 함)
          setData(newItems);
        } else {
          // 데이터가 있을 경우 바로 상태 업데이트
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const syncData = async (items) => {
    try {
      const existingDataResponse = await axios.get('https://67123da04eca2acdb5f7bcce.mockapi.io/api/restaurants');
      const existingData = existingDataResponse.data;

      // 중복된 항목을 걸러낸 후에만 새로운 데이터를 post
      const filteredItems = items.filter(item =>
        !existingData.some(existingItem =>
          existingItem.title === item.title && existingItem.address === item.address
        )
      );

      // 중복되지 않은 데이터만 Mock API에 저장
      await Promise.all(filteredItems.map(item =>
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

  const handleDeleteItem = async (itemToDelete) => {
    try {
      await axios.delete(`https://67123da04eca2acdb5f7bcce.mockapi.io/api/restaurants/${itemToDelete.id}`);
      const updatedData = data.filter(item => item.id !== itemToDelete.id);
      setData(updatedData);
      setSelectedItems(prevSelectedItems =>
        prevSelectedItems.filter(item => item.id !== itemToDelete.id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateItem = (item) => {
    navigate(`/edit/${item.id}`, { state: { item } });
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
          return;
        }

        await Promise.all(selectedItems.map(async (item) => {
          await axios.post('https://67123da04eca2acdb5f7bcce.mockapi.io/api/favorites', {
            title: item.title,
            address: item.address,
            tel: item.tel,
            category2: item.category2,
            category3: item.category3,
            information: item.information,
            operatingTime: item.operatingTime
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

  // 로딩 중이거나 오류가 발생한 경우 반환
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
                          <strong>전화번호:</strong> {item.tel} <br />
                          <strong>나라:</strong> {item.category2} <br />
                          <strong>category3:</strong> {item.category3} <br />
                          <strong>정보:</strong> {item.information} <br />
                          <strong>운영시간:</strong> {item.operatingTime} <br />
                        </Card.Text>
                      </div>
                    </div>
                    <Button className="delete-button" onClick={(e) => { handleDeleteItem(item); }}>
                      삭제
                    </Button>
                    <Button className="update-button" onClick={() => handleUpdateItem(item)}>
                      수정
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