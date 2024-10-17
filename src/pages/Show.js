import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Show.css';

const Show = () => {
  const [data, setData] = useState([]);  // 데이터 상태
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalData = [];  // 모든 데이터를 저장할 배열
        let pageNo = 1;  // 페이지 번호
        let hasMoreData = true;  // 데이터가 더 있는지 여부

        // 데이터를 요청하는 반복문
        while (hasMoreData) {
          const response = await axios.get(
            `http://api.kcisa.kr/openapi/API_TOU_052/request?serviceKey=8b023383-2375-4dd2-a484-a4ad2cbcecb2&numOfRows=100&pageNo=${pageNo}`
          );

          // 응답 로그
          console.log('API Response:', response.data);

          const items = response.data.body.items;
          if (items && items.item) {
            totalData.push(...items.item);  // 받은 데이터 추가
            pageNo++;  // 다음 페이지로 이동
          } else {
            hasMoreData = false;  // 더 이상 데이터가 없으면 종료
          }

          // totalCount 확인 후 종료
          const totalCount = parseInt(response.data.body.totalCount, 10);
          if (totalData.length >= totalCount) {
            hasMoreData = false;  // 전체 데이터 수에 도달했으면 종료
          }
        }

        setData(totalData);  // 모든 데이터 설정
      } catch (err) {
        setError(err);  // 에러 발생 시 에러 상태 설정
      } finally {
        setLoading(false);  // 로딩 완료
      }
    };

    fetchData();  // 데이터 요청
  }, []);  // 컴포넌트 마운트 시 호출

  // 로딩 중이면 로딩 메시지 출력
  if (loading) return <div>Loading...</div>;

  // 에러 발생 시 에러 메시지 출력
  if (error) return <div>Error: {error.message}</div>;

  // 데이터를 표시하는 부분
  return (
    <div className="email-container">
      <h1>맛집 리스트</h1>
      {data.length > 0 ? (
        data.map((item, index) => (
          <div key={index} className="email-item">
            <div className="email-title">{item.title}</div>
            <div className="email-snippet">
              <p><strong>주소:</strong> {item.addr}</p>
              <p><strong>전화번호:</strong> {item.tel}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default Show;
