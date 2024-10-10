import axios from "axios";
import React, { useEffect, useState } from "react";

// API 가져오기
const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        "http://api.kcisa.kr/openapi/API_CNV_065/request?serviceKey=8b023383-2375-4dd2-a484-a4ad2cbcecb2&numOfRows=10&pageNo=1&schNm=%EB%8C%80%EC%A0%84%EC%86%A1%EC%B4%8C&dist=100"
      )
      .then((response) => {
        setData(response.data.response.body.items.item);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>; // 로딩
  if (error) return <div>Error: {error.message}</div>; // 에러

  return (
    <>
      {data?.map((item, index) => (
        <div key={index}>
          <h1>{item.schNm}</h1>
          <p>{item.fcltyNm}</p>
        </div>
      ))}
    </>
  );
};

export default App;
