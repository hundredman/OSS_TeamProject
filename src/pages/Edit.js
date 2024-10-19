import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import './Create.css'; // Create.js와 동일한 스타일 적용

const Edit = () => {
  const { id } = useParams(); // URL 파라미터로부터 id 가져오기
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 기존 데이터 불러오기
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://67123da04eca2acdb5f7bcce.mockapi.io/api/restaurants/${id}`);
        const restaurant = response.data;

        // form에 기존 데이터 설정
        setValue('title', restaurant.title);
        setValue('address', restaurant.address);
        setValue('tel', restaurant.tel);
        setValue('category2', restaurant.category2);
        setValue('category3', restaurant.category3);
        setValue('information', restaurant.information);
        setValue('operatingTime', restaurant.operatingTime);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const updatedRestaurant = {
        title: data.title,
        address: data.address,
        tel: data.tel,
        category2: data.category2,
        category3: data.category3,
        information: data.information,
        operatingTime: data.operatingTime,
      };

      const response = await axios.put(`https://67123da04eca2acdb5f7bcce.mockapi.io/api/restaurants/${id}`, updatedRestaurant);

      if (response.status === 200) {
        alert('맛집 정보가 수정되었습니다.');
        navigate('/list'); // 수정 후 List 페이지로 이동
      } else {
        alert('맛집 수정에 실패했습니다.');
      }
    } catch (err) {
      alert('맛집 수정 중 오류가 발생했습니다.');
      console.error('Error:', err.response ? err.response.data : err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="layout">
      <div className="sidebar">
        <Link to="/" className="sidebar-button home-button">Main Page</Link>
        <Link to="/list" className="sidebar-button small-button">Go to List</Link>
      </div>

      <div className="main-content">
        <h1>맛집 수정</h1>
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

          <Form.Group controlId="formCategory2">
            <Form.Label>나라</Form.Label>
            <Form.Control
              type="text"
              placeholder="나라를 입력하세요."
              {...register('category2', { required: '카테고리는 필수입니다.' })}
            />
            {errors.category2 && <p className="error">{errors.category2.message}</p>}
          </Form.Group>

          <Form.Group controlId="formCategory3">
            <Form.Label>Category3</Form.Label>
            <Form.Control
              type="text"
              placeholder="Category3를 입력하세요."
              {...register('category3', { required: '카테고리는 필수입니다.' })}
            />
            {errors.category3 && <p className="error">{errors.category3.message}</p>}
          </Form.Group>

          <Form.Group controlId="formInformation">
            <Form.Label>정보</Form.Label>
            <Form.Control
              type="text"
              placeholder="정보를 입력하세요."
              {...register('information', { required: '정보는 필수입니다.' })}
            />
            {errors.information && <p className="error">{errors.information.message}</p>}
          </Form.Group>

          <Form.Group controlId="formOperatingTime">
            <Form.Label>운영시간</Form.Label>
            <Form.Control
              type="text"
              placeholder="운영시간을 입력하세요."
              {...register('operatingTime', { required: '운영시간은 필수입니다.' })}
            />
            {errors.operatingTime && <p className="error">{errors.operatingTime.message}</p>}
          </Form.Group>

          <Button variant="primary" type="submit">
            수정
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Edit;
