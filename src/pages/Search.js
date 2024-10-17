import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Search.css'; // CSS 파일을 임포트합니다.

const Search = () => {
  const { searchTerm } = useParams(); // URL에서 검색어 가져오기
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // 로딩 중이면 로딩 메시지 출력
  if (loading) return <div className="loading">Loading...</div>;

  // 에러 발생 시 에러 메시지 출력
  if (error) return <div className="error">Error: {error.message}</div>;

  // 데이터 검색
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  ); // 검색어에 맞는 데이터 필터링

  return (
    <div className="search-results">
      <h1>검색 결과</h1>
      {filteredData.length > 0 ? (
        <div className="results-grid">
          {filteredData.map((item, index) => (
            <div className="result-card" key={index}>
              <h2>{item.title}</h2> {/* 맛집 이름 */}
              <p>주소: {item.address}</p> {/* 주소 */}
              <p>전화번호: {item.tel}</p> {/* 전화번호 */}
            </div>
          ))}
        </div>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default Search;
