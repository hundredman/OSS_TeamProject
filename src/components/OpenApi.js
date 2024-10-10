import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Axios 사용 시

const OpenApi = () => {
  const [data, setData] = useState(null);  // API로 받은 데이터를 저장
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태

  // useEffect로 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Open API 호출
        const response = await axios.get('https://www.culture.go.kr/data/openapi/getSwagger.do?openApiId=8b7f38bc-c668-4453-bf38-bcc6681453a4');
        setData(response.data);  // 데이터 설정
      } catch (err) {
        setError(err);  // 에러 발생 시 에러 상태 설정
      } finally {
        setLoading(false);  // 로딩 완료
      }
    };

    fetchData();
  }, []);  // 빈 배열은 컴포넌트가 처음 렌더링될 때만 실행됨

  // 로딩 중이면 로딩 메시지 출력
  if (loading) return <div>Loading...</div>;

  // 에러 발생 시 에러 메시지 출력
  if (error) return <div>Error: {error.message}</div>;

  // 데이터 출력
  return (
    <div>
      <h1>Open API Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre> {/* 받은 데이터를 보기 좋게 출력 */}
    </div>
  );
};

export default OpenApi;
