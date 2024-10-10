import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OpenApiRead = () => {
  const [data, setData] = useState([]);  // 데이터를 배열로 저장
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 번호
  const itemsPerPage = 10;  // 한 페이지에 보여줄 데이터 수
  const totalPages = 100;  // 전체 페이지 수 설정
  const [pageRange, setPageRange] = useState(0);  // 페이지 범위 (0, 10, 20 등)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://api.kcisa.kr/openapi/API_TOU_052/request?serviceKey=8b023383-2375-4dd2-a484-a4ad2cbcecb2&numOfRows=${itemsPerPage}&pageNo=${currentPage}`
        );
        setData(response.data.response.body.items.item);  // 데이터 설정
      } catch (err) {
        setError(err);  // 에러 발생 시 에러 상태 설정
      } finally {
        setLoading(false);  // 로딩 완료
      }
    };

    fetchData();
  }, [currentPage]);  // currentPage가 변경될 때마다 API 다시 호출

  // 로딩 중이면 로딩 메시지 출력
  if (loading) return <div>Loading...</div>;

  // 에러 발생 시 에러 메시지 출력
  if (error) return <div>Error: {error.message}</div>;

  // 페이지네이션 버튼 표시 로직
  const renderPageNumbers = () => {
    const pageButtons = [];
    const startPage = pageRange * 10 + 1;  // 시작 페이지 번호
    const endPage = Math.min(startPage + 9, totalPages);  // 끝 페이지 번호

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          style={{
            margin: '5px',
            padding: '10px',
            backgroundColor: currentPage === i ? 'lightblue' : 'white',
          }}
        >
          {i}
        </button>
      );
    }

    return pageButtons;
  };

  // 이전 10페이지 버튼 클릭 핸들러
  const handlePrevRange = () => {
    if (pageRange > 0) {
      setPageRange(pageRange - 1);
      setCurrentPage(pageRange * 10);
    }
  };

  // 다음 10페이지 버튼 클릭 핸들러
  const handleNextRange = () => {
    if (pageRange < Math.floor((totalPages - 1) / 10)) {
      setPageRange(pageRange + 1);
      setCurrentPage(pageRange * 10 + 11); // 다음 페이지로 이동
    }
  };

  return (
    <div>
      <h1>맛집 리스트 (페이지 {currentPage})</h1>
      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>맛집 이름</th>
              <th>주소</th>
              <th>전화번호</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.title}</td>  {/* 맛집 이름 */}
                <td>{item.address}</td>   {/* 주소 */}
                <td>{item.tel}</td>    {/* 전화번호 */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>데이터가 없습니다.</p>
      )}

      {/* 페이지네이션 버튼 */}
      <div>
        <button onClick={handlePrevRange} disabled={pageRange === 0}>
          이전 10페이지
        </button>
        {renderPageNumbers()}
        <button onClick={handleNextRange} disabled={pageRange >= Math.floor((totalPages - 1) / 10)}>
          다음 10페이지
        </button>
      </div>
    </div>
  );
};

export default OpenApiRead;
