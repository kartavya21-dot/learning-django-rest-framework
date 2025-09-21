import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Todo.css";

const backend = "http://127.0.0.1:8000/api/tasks/";

const Todo = () => {
  // const
  const [tasks, setTask] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getTask();
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleDelete = (task) => () => deleteTask(task);

  async function getTask() {
    try {
      const response = await axios.get(backend, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setTask(response.data);
    } catch (err) {
      console.log("Error Fetching Task");
    }
  }

  async function createTask() {
    try {
      await axios.post(
        backend,
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setTitle("");
      setDescription("");
      getTask();
    } catch (e) {
      console.log(e);
    }
  }

  async function updateTask(task) {
    console.log(task.title, task.completed);

    try {
      if (task.completed)
        await axios.put(`${backend}${task.id}/mark_incomplete/`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
      else
        await axios.put(`${backend}${task.id}/mark_completed/`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
      getTask();
    } catch (e) {
      console.log(e);
    }
  }
  async function deleteTask(task) {
    console.log(task.title, task.completed);

    try {
      await axios.delete(`${backend}${task.id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      getTask();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div id="to-do">
      <form
        className="input-section"
        onSubmit={(e) => {
          e.preventDefault();
          createTask();
        }}
      >
        <div className="input-section-text">
          <input
            placeholder="Add Title"
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
          <textarea
            placeholder="Add Description"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <button type="submit" id="add-button">
          Add Task
        </button>
      </form>
      <div id="task-list">
        {[...tasks].reverse().map((task) => (
          <div
            key={task.id}
            className={`task ${task.completed ? "completed-task" : ""}`}
          >
            <div>
              <h2 className={`${task.completed ? "checked" : ""}`}>
                {task.title}
              </h2>
              <p>{task.description}</p>
            </div>
            <div className="task-buttons">
              <input
                type="checkbox"
                checked={task.completed}
                onClick={() => updateTask(task)}
              />
              <button onClick={handleDelete(task)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
