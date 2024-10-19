import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './Edit.css'; // 스타일 파일 임포트

const Edit = () => {
    const { id } = useParams(); // URL 파라미터로부터 id 가져오기
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restaurant, setRestaurant] = useState(null); // 수정된 항목을 저장할 상태

    useEffect(() => {
        // 기존 데이터 불러오기
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://67123da04eca2acdb5f7bcce.mockapi.io/api/restaurants/${id}`);
                const restaurantData = response.data;

                // 불러온 데이터 form에 설정
                setValue('title', restaurantData.title);
                setValue('address', restaurantData.address);
                setValue('tel', restaurantData.tel);
                setValue('category2', restaurantData.category2);
                setValue('category3', restaurantData.category3);
                setValue('information', restaurantData.information);
                setValue('operatingTime', restaurantData.operatingTime);

                setRestaurant(restaurantData); // 상태 업데이트
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
        <div className="edit-container">
            {restaurant ? (
                <form className="edit-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="edit-title">
                        <h1 className="edit-title">{restaurant.title} 수정 페이지</h1>
                    </div>

                    <label className="edit-label" htmlFor="title">음식점 이름</label>
                    <input
                        className="edit-input"
                        type="text"
                        id="title"
                        {...register('title', { required: true })}
                    />
                    {errors.title && <p className="error-message">음식점 이름을 입력해주세요.</p>}

                    <label className="edit-label" htmlFor="address">나라</label>
                    <input
                        className="edit-input"
                        type="text"
                        id="category2"
                        {...register('category2', { required: true })}
                    />
                    {errors.address && <p className="error-message">나라를 입력해주세요.</p>}

                    <label className="edit-label" htmlFor="tel">전화번호</label>
                    <input
                        className="edit-input"
                        type="text"
                        id="tel"
                        {...register('tel', { required: true })}
                    />
                    {errors.tel && <p className="error-message">전화번호를 입력해주세요.</p>}

                    <label className="edit-label" htmlFor="tel">주소</label>
                    <input
                        className="edit-input"
                        type="text"
                        id="address"
                        {...register('address', { required: true })}
                    />
                    {errors.tel && <p className="error-message">주소를 입력해주세요.</p>}

                    <label className="edit-label" htmlFor="tel">정보</label>
                    <input
                        className="edit-input"
                        type="text"
                        id="information"
                        {...register('information', { required: true })}
                    />
                    {errors.tel && <p className="error-message">정보를 입력해주세요.</p>}

                    <label className="edit-label" htmlFor="tel">운영시간</label>
                    <input
                        className="edit-input"
                        type="text"
                        id="operatingTime"
                        {...register('operatingTime', { required: true })}
                    />
                    {errors.tel && <p className="error-message">운영시간을 입력해주세요.</p>}

                    <label className="edit-label" htmlFor="tel">위치</label>
                    <input
                        className="edit-input"
                        type="text"
                        id="coordinates"
                        {...register('coordinates', { required: true })}
                    />
                    {errors.tel && <p className="error-message">위치를 입력해주세요.</p>}

                    <button type="submit" className="edit-submit-button">저장</button>
                </form>
            ) : (
                <p>수정할 항목이 없습니다.</p>
            )}
        </div>
    );
};

export default Edit;
