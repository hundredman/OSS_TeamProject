import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
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
      tel: data.tel,
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
    <div className="layout">
      <div className="sidebar">
        <Link to="/" className="sidebar-button home-button">Main Page</Link>
        <Link to="/list" className="sidebar-button small-button">Go to List</Link>
      </div>

      <div className="main-content">
        <h1>맛집 추가</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="formTitle">
            <Form.Label>맛집 이름</Form.Label>
            <Form.Control
              type="text"
              placeholder="맛집 이름을 입력하세요."
              {...register('title', { required: '맛집 이름은 필수입니다.' })}
            />
            {errors.title && <p className="error">{errors.title.message}</p>}
          </Form.Group>

          <Form.Group controlId="formAddress">
            <Form.Label>주소</Form.Label>
            <Form.Control
              type="text"
              placeholder="주소를 입력하세요."
              {...register('address', { required: '주소는 필수입니다.' })}
            />
            {errors.address && <p className="error">{errors.address.message}</p>}
          </Form.Group>

          <Form.Group controlId="formTel">
            <Form.Label>전화번호</Form.Label>
            <Form.Control
              type="text"
              placeholder="전화번호를 입력하세요."
              {...register('tel', { required: '전화번호는 필수입니다.' })}
            />
            {errors.tel && <p className="error">{errors.tel.message}</p>}
          </Form.Group>

          <Button variant="primary" type="submit">
            추가
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Create;
