import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";

const initialState = { title: "", description: "", status: "false", due_date: "" };

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState(initialState);
    const [isEdit, setIsEdit] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const navigate = useNavigate();
    const API = process.env.REACT_APP_API;

    const handleLogout = useCallback(() => {
        localStorage.clear();
        navigate("/");
    }, [navigate]);

    const getTasks = useCallback(async () => {
        try {
            const response = await fetch(`${API}/task/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 401) return handleLogout(); // expired token
            if (response.ok) {
                const data = await response.json();
                setTasks(data.tasks);
            }
        } catch (error) {
            console.log("error", error);
        }
    }, [API, token, handleLogout]);

    useEffect(() => {
        if (!token) {
            handleLogout();
            return;
        }
        getTasks();
    }, [token, getTasks, handleLogout]);

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData(initialState);
        setIsEdit(false);
        setEditTaskId(null);
    };

    // One function for both create and update
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, description, status, due_date } = formData;
        const body = { title, description, status: status === "true", due_date };
        if (isEdit) body.id = editTaskId;

        try {
            const res = await fetch(`${API}/task/`, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            setMessage(data.message || (res.ok ? "Saved." : "Something went wrong."));
            if (res.ok) {
                resetForm();
                getTasks();
            }
        } catch (error) {
            console.log("error", error);
            setMessage("Cannot reach the server.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            const res = await fetch(`${API}/task/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            setMessage(data.message || "Deleted.");
            if (res.ok) getTasks();
        } catch (error) {
            console.log("error", error);
        }
    };

    const getDateFromTimestamp = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleEdit = (id) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;
        setIsEdit(true);
        setEditTaskId(id);
        setFormData({
            title: task.title,
            description: task.description,
            status: String(task.status),
            due_date: getDateFromTimestamp(task.due_date),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="tasks-page">
            <div className="topbar">
                <div className="user">
                    <span className="avatar"><FaUser /></span>
                    {username}
                </div>
                <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                    Log out
                </button>
            </div>

            <div className="panel">
                <h3>{isEdit ? "Edit task" : "Add task"}</h3>
                {message && <div className="notice">{message}</div>}
                <form className="task-form" onSubmit={handleSubmit}>
                    <label>
                        Title
                        <input className="input-fields" type="text" name="title"
                            placeholder="What needs doing?" value={formData.title}
                            onChange={handleInput} required />
                    </label>
                    <label>
                        Description
                        <input className="input-fields" type="text" name="description"
                            placeholder="Details" value={formData.description}
                            onChange={handleInput} required />
                    </label>
                    <label>
                        Status
                        <select className="input-fields" name="status"
                            value={formData.status} onChange={handleInput}>
                            <option value="false">Active</option>
                            <option value="true">Done</option>
                        </select>
                    </label>
                    <label>
                        Due date
                        <input className="input-fields" type="date" name="due_date"
                            value={formData.due_date} onChange={handleInput} required />
                    </label>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            {isEdit ? "Save changes" : "Add task"}
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={resetForm}>
                            {isEdit ? "Cancel" : "Clear"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="panel table-wrap">
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Due</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 && (
                            <tr><td colSpan="5" className="empty">No tasks yet. Add your first one above.</td></tr>
                        )}
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td>
                                    <span className={`badge ${task.status ? "done" : "active"}`}>
                                        {task.status ? "Done" : "Active"}
                                    </span>
                                </td>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{getDateFromTimestamp(task.due_date)}</td>
                                <td>
                                    <div className="actions">
                                        <button type="button" className="btn btn-ghost btn-icon"
                                            aria-label="Edit task" onClick={() => handleEdit(task.id)}>
                                            <MdEdit />
                                        </button>
                                        <button type="button" className="btn btn-danger btn-icon"
                                            aria-label="Delete task" onClick={() => handleDelete(task.id)}>
                                            <MdDelete />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Task;