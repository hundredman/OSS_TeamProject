import React from 'react';
import { useLocation } from 'react-router-dom';

const Edit = () => {
  const location = useLocation();
  const { item } = location.state || {};

  return (
    <div>
      {item ? (
        <div>
          <h1>{item.title} 수정 페이지</h1>
          <p>주소: {item.address}</p>
          <p>전화번호: {item.tel}</p>
          {/* 수정 폼을 여기에 추가 */}
        </div>
      ) : (
        <p>수정할 항목이 없습니다.</p>
      )}
    </div>
  );
};

export default Edit;
