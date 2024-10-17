import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./User.css";

const EditUser = () => {
  const [user, setUser] = useState({});
  const { id } = useParams();
  const getUserApi = "https://66ff38382b9aac9c997e8fe8.mockapi.io/api/users";

  // useCallback을 사용하여 getUser 함수 정의
  const getUser = useCallback(() => {
    axios
      .get(`${getUserApi}/${id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getUserApi, id]); // 의존성 배열에 getUserApi와 id 추가

  // useEffect로 getUser 호출
  useEffect(() => {
    getUser();
  }, [getUser]); // getUser를 의존성으로 추가

  return (
    <div className="user mt-5">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{user.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>{user.phone}</td>
          </tr>
          <tr>
            <td>Relation</td>
            <td>{user.relation}</td>
          </tr>
          <tr>
            <td>Age</td>
            <td>{user.age}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EditUser;