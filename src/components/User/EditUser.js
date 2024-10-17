import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../Common/Loader";
import "./User.css";

const EditUser = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const getUserApi = "https://66ff38382b9aac9c997e8fe8.mockapi.io/api/users";

  // useCallback을 사용하여 함수 정의
  const getUser = useCallback(() => {
    setIsLoading(true); // 로딩 시작
    axios
      .get(`${getUserApi}/${id}`)
      .then((response) => {
        setUser(response.data);
        setIsLoading(false); // 로딩 끝
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
        setIsLoading(false); // 로딩 끝
      });
  }, [getUserApi, id]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // 로딩 시작

    fetch(`${getUserApi}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        setIsLoading(false); // 로딩 끝
        navigate("/show-user");
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false); // 로딩 끝
      });
  };

  return (
    <div className="user-form">
      <div className="heading">
        {isLoading && <Loader />}
        {error && <p>Error: {error}</p>}
        <p>Edit Form</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={user.name || ""}
            onChange={handleInput}
          />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={user.email || ""}
            onChange={handleInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={user.phone || ""}
            onChange={handleInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="relation" className="form-label">
            Relation
          </label>
          <input
            type="text"
            className="form-control"
            id="relation"
            name="relation"
            value={user.relation || ""}
            onChange={handleInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">
            Age
          </label>
          <input
            type="text"
            className="form-control"
            id="age"
            name="age"
            value={user.age || ""}
            onChange={handleInput}
          />
        </div>
        <button type="submit" className="btn btn-primary submit-btn">
          EDIT
        </button>
      </form>
    </div>
  );
};

export default EditUser;