import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // 페이지 이동을 위한 Link 임포트
import './List.css'; // CSS 파일을 임포트합니다.

const List = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
  const totalPages = 150; // API에서 가져올 총 데이터 수

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://api.kcisa.kr/openapi/API_TOU_052/request?serviceKey=8b023383-2375-4dd2-a484-a4ad2cbcecb2&numOfRows=${totalPages}&pageNo=1`
        );
        setData(response.data.response.body.items.item); // 데이터 설정
      } catch (err) {
        setError(err); // 에러 발생 시 에러 상태 설정
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchData();
  }, []); // 컴포넌트가 처음 렌더링될 때만 호출

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) // 검색어 필터링
  );

  // 로딩 중이면 로딩 메시지 출력
  if (loading) return <div className="loading">Loading...</div>;

  // 에러 발생 시 에러 메시지 출력
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="layout">
      {/* 사이드바 */}
      <div className="sidebar">
        <Link to="/" className="sidebar-button home-button">
          Main Page
        </Link>
        <Link to="/create" className="sidebar-button large-button">
          음식점추가
        </Link>
        <Link to="/listing" className="sidebar-button small-button">
          Go to List
        </Link>
      </div>
      
      {/* 메인 컨텐츠 */}
      <div className="main-content">
        <h1>맛집 리스트</h1>
        {/* 검색창 추가 */}
        <input
          type="text"
          className="search-bar-list"
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // 검색어 상태 업데이트
        />
        {filteredData.length > 0 ? (
          <div className="card-container">
            {filteredData.map((item, index) => (
              <div className="card" key={index}>
                <input type="checkbox" className="card-checkbox" /> {/* 체크박스 추가 */}
                <h2>{item.title}</h2> {/* 맛집 이름 */}
                <p><strong>주소:</strong> {item.address}</p> {/* 주소 */}
                <p><strong>전화번호:</strong> {item.tel}</p> {/* 전화번호 */}
              </div>
            ))}
          </div>
        ) : (
          <p>데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default List;
