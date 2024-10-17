import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RestaurantList = ({ searchTerm }) => {
  const [data, setData] = useState([]); // 데이터를 배열로 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const itemsPerPage = 10; // 한 페이지에 보여줄 데이터 수

  // 데이터를 가져오는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://api.kcisa.kr/openapi/API_TOU_052/request?serviceKey=8b023383-2375-4dd2-a484-a4ad2cbcecb2&numOfRows=${itemsPerPage}&pageNo=${currentPage}`
        );
        setData(response.data.response.body.items.item); // 데이터 설정
      } catch (err) {
        setError(err); // 에러 발생 시 에러 상태 설정
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchData();
  }, [currentPage]); // currentPage가 변경될 때마다 API 다시 호출

  // 로딩 중이면 로딩 메시지 출력
  if (loading) return <div>Loading...</div>;

  // 에러 발생 시 에러 메시지 출력
  if (error) return <div>Error: {error.message}</div>;

  // 데이터 검색
  const filteredData = searchTerm
    ? data.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : data;

  return (
    <div>
      <h1>맛집 리스트</h1>

      {filteredData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>맛집 이름</th>
              <th>주소</th>
              <th>전화번호</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.title}</td> {/* 맛집 이름 */}
                <td>{item.address}</td> {/* 주소 */}
                <td>{item.tel}</td> {/* 전화번호 */}
                <td>
                  <button onClick={() => {
                    setData(prevData => prevData.filter((_, i) => i !== index));
                  }}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default RestaurantList;
