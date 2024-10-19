import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Create.css';

const Create = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const newRestaurant = {
      createdAt: new Date().toISOString(), // 현재 시간의 ISO 문자열
      name: '', // 이름은 비워둠
      avatar: '', // 아바타는 비워둠
      id: '', // ID는 비워둠 (서버에서 자동 생성되도록 할 수 있음)
      title: data.title,
      address: data.address,
      category2: data.category2,
      category3: data.category3,
      information: data.information,
      operatingTime: data.operatingTime,
    };

    try {
      const response = await axios.post('https://67123da04eca2acdb5f7bcce.mockapi.io/api/restaurants', newRestaurant);

      // 요청 성공 시 상태 코드 확인
      if (response.status === 201) {
        alert('맛집이 추가되었습니다.');
        navigate('/list'); // 추가 후 List 페이지로 이동
      } else {
        alert('맛집 추가에 실패했습니다.');
      }
    } catch (err) {
      alert('맛집 추가 중 오류가 발생했습니다.');
      console.error('Error:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="edit-container">
      <form className="edit-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="edit-title">
          <h1 className="edit-title">새로운 맛집 추가</h1>
        </div>

        <label className="edit-label" htmlFor="title">음식점 이름</label>
        <input
          className="edit-input"
          type="text"
          id="title"
          {...register('title', { required: true })}
        />
        {errors.title && <p className="error-message">음식점 이름을 입력해주세요.</p>}

        <label className="edit-label" htmlFor="category2">나라</label>
        <input
          className="edit-input"
          type="text"
          id="category2"
          {...register('category2', { required: true })}
        />
        {errors.category2 && <p className="error-message">나라를 입력해주세요.</p>}

        <label className="edit-label" htmlFor="tel">전화번호</label>
        <input
          className="edit-input"
          type="text"
          id="tel"
          {...register('tel', { required: true })}
        />
        {errors.tel && <p className="error-message">전화번호를 입력해주세요.</p>}

        <label className="edit-label" htmlFor="address">주소</label>
        <input
          className="edit-input"
          type="text"
          id="address"
          {...register('address', { required: true })}
        />
        {errors.address && <p className="error-message">주소를 입력해주세요.</p>}

        <label className="edit-label" htmlFor="information">정보</label>
        <input
          className="edit-input"
          type="text"
          id="information"
          {...register('information', { required: true })}
        />
        {errors.information && <p className="error-message">정보를 입력해주세요.</p>}

        <label className="edit-label" htmlFor="operatingTime">운영시간</label>
        <input
          className="edit-input"
          type="text"
          id="operatingTime"
          {...register('operatingTime', { required: true })}
        />
        {errors.operatingTime && <p className="error-message">운영시간을 입력해주세요.</p>}

        <label className="edit-label" htmlFor="coordinates">위치</label>
        <input
          className="edit-input"
          type="text"
          id="coordinates"
          {...register('coordinates', { required: true })}
        />
        {errors.coordinates && <p className="error-message">위치를 입력해주세요.</p>}

        <button type="submit" className="edit-submit-button">저장</button>
      </form>
    </div>
  );
};

export default Create;
