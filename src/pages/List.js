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
          category2: item.category2,
          tel: item.tel,
          address: item.address,
          information: item.information,
          operatingTime: item.operatingTime,
          coordinates: item.coordinates
        })
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckboxChange = (item) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.some(i => i.id === item.id)) {
        // 이미 선택된 항목이면 배열에서 제거
        return prevSelectedItems.filter(i => i.id !== item.id);
      } else {
        // 선택되지 않은 항목이면 배열에 추가
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
    // 선택된 항목이 없으면 아무 작업도 하지 않음
    if (selectedItems.length === 0) {
      alert('선택된 맛집이 없습니다.');
      return;
    }

    try {
      const favoritesResponse = await axios.get('https://67123da04eca2acdb5f7bcce.mockapi.io/api/favorites');
      const existingFavorites = favoritesResponse.data;

      // 중복 확인을 위한 변수를 생성
      const newFavorites = selectedItems.filter(item =>
        !existingFavorites.some(favorite =>
          favorite.title === item.title && favorite.address === item.address
        )
      );

      // 새로 추가할 맛집이 없으면 경고 메시지 표시
      if (newFavorites.length === 0) {
        alert('선택한 맛집이 모두 이미 즐겨찾기에 추가되어 있습니다.');
        return;
      }

      await Promise.all(newFavorites.map(async (item) => {
        await axios.post('https://67123da04eca2acdb5f7bcce.mockapi.io/api/favorites', {
          title: item.title,
          category2: item.category2,
          tel: item.tel,
          address: item.address,
          information: item.information,
          operatingTime: item.operatingTime,
          coordinates: item.coordinates
        });
      }));

      alert('선택한 맛집이 즐겨찾기에 추가되었습니다.');

      // 선택된 항목 리셋 (체크박스 해제)
      setSelectedItems([]);
    } catch (err) {
      console.error(err);
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
                        checked={selectedItems.some(i => i.id === item.id)}
                      />
                      <div>
                        <Card.Title className="card-title">{item.title}</Card.Title>
                        <Card.Text className="card-text">
                          <p><strong>나라:</strong> {item.category2}</p>
                          <p><strong>전화번호:</strong> {item.tel}</p>
                          <p><strong>주소:</strong> {item.address}</p>
                          <p><strong>정보:</strong> {item.information}</p>
                          <p><strong>운영시간:</strong> {item.operatingTime}</p>
                          <p><strong>좌표:</strong> {item.coordinates}</p>
                        </Card.Text>
                      </div>
                    </div>
                    <div className="button-container">
                      <Button className="delete-button" onClick={(e) => { handleDeleteItem(item); }}>
                        삭제
                      </Button>
                      <Button className="update-button" onClick={() => handleUpdateItem(item)}>
                        수정
                      </Button>
                    </div>
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