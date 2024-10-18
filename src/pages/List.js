import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { syncData } from '../mockApiService';
import './List.css';

const List = ({ selectedItems, setSelectedItems }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지에 표시할 항목 수

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://api.kcisa.kr/openapi/API_TOU_052/request?serviceKey=8b023383-2375-4dd2-a484-a4ad2cbcecb2&numOfRows=150&pageNo=1`
        );
        setData(response.data.response.body.items.item);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 체크박스 선택 처리
  const handleCheckboxChange = (item) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter(i => i !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  // 항목 삭제 처리
  const handleDeleteItem = (itemToDelete) => {
    const updatedData = data.filter(item => item !== itemToDelete);
    setData(updatedData);

    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.filter(item => item !== itemToDelete)
    );
  };

  // 리스트에 추가 처리
  const handleAddToList = async () => {
    try {
      await syncData(data); // MockAPI와 동기화
      alert('리스트가 MockAPI에 성공적으로 추가되었습니다.');
    } catch (err) {
      alert('리스트 추가 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  // 페이지 변경 핸들러
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

  // 필터링된 데이터
  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 현재 페이지의 데이터 가져오기
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="layout">
      <div className="sidebar">
        <Link to="/" className="sidebar-button home-button">Main Page</Link>
        <Link to="/create" className="sidebar-button large-button">음식점 추가</Link> {/* 새로운 버튼 추가 */}
        <Link to="/favorite" className="sidebar-button small-button">Go to List</Link>
      </div>

      <div className="main-content">
        <h1>맛집 리스트</h1>

        <div className="search-add-container">
          <button className="add-to-favorite-button" onClick={handleAddToList}>
            리스트에 추가
          </button>

          <input
            type="text"
            className="search-bar-list"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* 페이지네이션 버튼 */}
          <div className="pagination">
            <button
              className="page-button"
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
            >
              {'<'}
            </button>
            <button
              className="page-button"
              onClick={() => handlePageChange('next')}
              disabled={currentPage * itemsPerPage >= filteredData.length}
            >
              {'>'}
            </button>
          </div>
        </div>

        {/* 현재 페이지 정보 표시 */}
        <div className="pagination-info">
          {`Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredData.length)} of ${filteredData.length}`}
        </div>

        <div className="card-container" style={{ marginTop: '20px' }}>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <div className="card" key={index}>
                <input
                  type="checkbox"
                  className="card-checkbox"
                  onChange={() => handleCheckboxChange(item)}
                  checked={selectedItems.includes(item)}
                />
                <h2>{item.title}</h2>
                <p><strong>주소:</strong> {item.address}</p>
                <p><strong>전화번호:</strong> {item.tel}</p>
                <button className="delete-button" onClick={() => handleDeleteItem(item)}>
                  삭제
                </button>
              </div>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
