import React, { useState, useEffect } from "react";
import {baseUrl} from "../utils/baseUrl";
import { getCookie } from "../utils/getCookie";
import "./App.css";

const Form = () => {
  const [todoList, setTodoList] = useState([]);
  const [editing, setEditing] = useState(false);
  const [activeItem, setActiveItem] = useState({
    completed: false,
    id: null,
    title: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch(`${baseUrl}`)
      .then((response) => response.json())
      .then((data) => setTodoList(data));
  };

  const handleChange = (e) => {
    setActiveItem({
      ...activeItem,
      title: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let csrftoken = getCookie("csrftoken");
    let url = `${baseUrl}`;

    if (editing === false) {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(activeItem),
      })
        .then((response) => {
          fetchTasks();
          setActiveItem({
            id: null,
            title: "",
            completed: false,
          });
        })
        .catch(function (error) {
          console.log("ERROR:", error);
        });
    }

    if (editing === true) {
      url = `${baseUrl}update/${activeItem.id}/`;
      setEditing(false);
      fetch(url, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(activeItem),
      })
        .then((response) => {
          fetchTasks();
          setActiveItem({
            id: null,
            title: "",
            completed: false,
          });
        })
        .catch(function (error) {
          console.log("ERROR EDITING:", error);
        });
    }
  };

  return (
    <div id="form-wrapper">
      <form onSubmit={handleSubmit} id="form">
        <div className="flex-wrapper">
          <div style={{ flex: 6 }}>
            <input
              onChange={handleChange}
              className="form-control"
              id="title"
              value={activeItem.title}
              type="text"
              name="title"
              placeholder="Add task.."
            />
          </div>
          <div style={{ flex: 1 }}>
            <input
              id="submit"
              className="btn btn-warning"
              type="submit"
              name="Add"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
