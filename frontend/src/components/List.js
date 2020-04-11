import React, { useEffect, useState } from "react";
import { baseUrl } from "../utils/baseUrl";
import { getCookie } from "../utils/getCookie";
import "./App.css";

const List = () => {
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

  const handleStrike = (task) => {
    task.completed = !task.completed;
    let csrftoken = getCookie("csrftoken");
    let url = `${baseUrl}strike/${task.id}/`;

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ completed: task.completed, title: task.title }),
    }).then(() => {
      fetchTasks();
    });
  };

  const handleUpdate = (task) => {
    setActiveItem(task);
    setEditing(true);
  };

  const handleDelete = (task) => {
    let csrftoken = getCookie("csrftoken");

    fetch(`${baseUrl}delete/${task.id}/`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      fetchTasks();
    });
  };

  return (
    <div id="list-wrapper">
      {todoList.map(function (task, index) {
        return (
          <div key={index} className="task-wrapper flex-wrapper">
            <div onClick={() => handleStrike(task)} style={{ flex: 7 }}>
              {task.completed === false ? (
                <span>{task.title}</span>
              ) : (
                <strike>{task.title}</strike>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <button
                onClick={() => handleUpdate(task)}
                className="btn btn-sm btn-outline-info"
              >
                Edit
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <button
                onClick={() => handleDelete(task)}
                className="btn btn-sm btn-outline-dark delete"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default List;
