import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";

const initialState = { title: "", description: "", status: "", due_date: "" };

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState(initialState);
    const [isEdit, setIsEdit] = useState(false);
    const [editTaskId, setEditTaskId] = useState("");

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            handleLogout();
        }
        getTasks();
    }, []);

    const getTasks = async () => {
        const response = await fetch(`${process.env.REACT_APP_API}/task/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setTasks(data.tasks);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = localStorage.getItem("username");
        let { title, description, status, due_date } = formData;
        if (status === "true") {
            status = true;
        } else {
            status = false;
        }
        try {
            const res = await fetch(`${process.env.REACT_APP_API}/task/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, status, due_date, username }),
            });
            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                setFormData(initialState);
                getTasks();
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API}/task/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                getTasks();
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const getDateFromTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const handleEdit = (id) => {
        // console.log("id", id);
        setIsEdit(true);
        const edit_task = tasks.find((task) => task.id === id);
        setEditTaskId(id);
        setFormData({
            ...formData,
            title: edit_task.title,
            description: edit_task.description,
            status: edit_task.status,
            due_date: getDateFromTimestamp(edit_task.due_date),
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        let { title, description, status, due_date } = formData;
        if (status === "true") {
            status = true;
        } else {
            status = false;
        }
        const id = editTaskId;
        try {
            const res = await fetch("http://localhost:8000/auth/task/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, status, due_date, id }),
            });
            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                getTasks();
                setFormData(initialState);
                setIsEdit(false);
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
        <div className="tasks-list center">
            <div className="task-head flex justify-between row">
                <h5 className="flex text-xl font-bold col-md-6 col-sm-1"><FaUser /> {username}</h5>
                <button
                    className="flex text-right px-3 py-3 rounded-lg col-md-2 btn btn-danger logOut"
                    onClick={handleLogout}
                > Log Out
                </button>
            </div>
            <div>
                <h3 className="text-center">Add Task</h3>
                <form className="space-y-4 add-task-form">
                    <div style={{ display: "flex", width: "50%" }}>
                        <input
                            className="input-fields"
                            type="title"
                            placeholder="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInput}
                            required
                        />
                        <input
                            className="input-fields"
                            type="description"
                            placeholder="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInput}
                            required
                        />
                        <input
                            className="input-fields"
                            type="status"
                            placeholder="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleInput}
                            required
                        />
                        <input
                            className="input-fields"
                            type="due_date"
                            placeholder="Due Date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleInput}
                            required
                        />
                    </div>
                    <div style={{ display: "flex", width: "50%", justifyContent: "center" }}>
                        {isEdit ? <button onClick={handleUpdate} >Update</button> : <button onClick={handleSubmit}>Submit</button>}
                        <button onClick={() => setFormData(initialState)} >Reset</button>
                    </div>
                </form>
            </div>
            <div>
                <table className="table">
                    <thead className="table-dark">
                        <tr>
                            <th>Status</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.status === true ? "Done" : "Active"}</td>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => handleEdit(task.id)}>
                                        <MdEdit />
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>
                                        <MdDelete />
                                    </button>
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
