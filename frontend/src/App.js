import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [todoList, setTodoList] = useState([]);
  const [editing, setEditing] = useState(false);
  const [activeItem, setActiveItem] = useState({
    completed: false,
    id: null,
    title: "",
  });

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      let cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch(`${baseUrl}task-list/`)
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
    let url = `${baseUrl}task-create/`;

    if (editing === true) {
      url = `${baseUrl}task-update/${activeItem.id}/`;
      setEditing(false);
    }

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
  };

  const handleEdit = (task) => {
    setActiveItem(task);
    setEditing(true);
  };

  const handleDelete = (task) => {
    let csrftoken = getCookie("csrftoken");

    fetch(`${baseUrl}task-delete/${task.id}/`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      fetchTasks();
    });
  };

  const handleStrike = (task) => {
    task.completed = !task.completed;
    let csrftoken = getCookie("csrftoken");
    let url = `${baseUrl}task-update/${task.id}/`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ completed: task.completed, title: task.title }),
    }).then(() => {
      fetchTasks();
    });
  };

  return (
    <div className="container">
      <div id="task-container">
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
                    onClick={() => handleEdit(task)}
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
      </div>
    </div>
  );
};

export default App;
