import React, { useEffect, useState } from "react";
import socket from "../services/socket";

const Employees = () => {
    const [employees, setEmployees] = useState([]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        joiningDate: "",
        salary: "",
        status: "Active"
    });

    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState(null);

    // GET LOGGED-IN USER ROLE
    const storedUser = localStorage.getItem("user");

    let currentUser = null;

    try {
        currentUser = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch (error) {
        currentUser = null;
    }

    const isAdmin = currentUser?.role === "admin";

    // FETCH EMPLOYEES
    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("token");

            let url = "http://localhost:5000/api/employees";

            const params = new URLSearchParams();

            if (search) {
                params.append("search", search);
            }

            if (department) {
                params.append("department", department);
            }

            if (status) {
                params.append("status", status);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setEmployees(data.data);
            } else {
                setMessage(
                    data.message || "Failed to load employees"
                );
            }

        } catch (error) {
            setMessage("Unable to connect to backend");
        }
    };

    // FETCH WHEN SEARCH / FILTER CHANGES
    useEffect(() => {
        fetchEmployees();
    }, [search, department, status]);

    // REAL-TIME SOCKET EVENTS
    useEffect(() => {
        const handleConnect = () => {
            console.log(
                "Socket connected from Employees page:",
                socket.id
            );
        };

        const handleConnectError = (error) => {
            console.log(
                "Socket connection error:",
                error.message
            );
        };

        const handleEmployeeAdded = () => {
            console.log("Real-time employee added");
            fetchEmployees();
        };

        const handleEmployeeUpdated = () => {
            console.log("Real-time employee updated");
            fetchEmployees();
        };

        const handleEmployeeDeleted = () => {
            console.log("Real-time employee deleted");
            fetchEmployees();
        };

        socket.on("connect", handleConnect);

        socket.on(
            "connect_error",
            handleConnectError
        );

        socket.on(
            "employeeAdded",
            handleEmployeeAdded
        );

        socket.on(
            "employeeUpdated",
            handleEmployeeUpdated
        );

        socket.on(
            "employeeDeleted",
            handleEmployeeDeleted
        );

        return () => {
            socket.off(
                "connect",
                handleConnect
            );

            socket.off(
                "connect_error",
                handleConnectError
            );

            socket.off(
                "employeeAdded",
                handleEmployeeAdded
            );

            socket.off(
                "employeeUpdated",
                handleEmployeeUpdated
            );

            socket.off(
                "employeeDeleted",
                handleEmployeeDeleted
            );
        };
    }, []);

    // FORM CHANGE
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // RESET FORM
    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            phone: "",
            role: "",
            department: "",
            joiningDate: "",
            salary: "",
            status: "Active"
        });

        setEditingId(null);
    };

    // ADD / UPDATE EMPLOYEE
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const url = editingId
                ? `http://localhost:5000/api/employees/${editingId}`
                : "http://localhost:5000/api/employees";

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    ...form,
                    salary: form.salary
                        ? Number(form.salary)
                        : undefined
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage(
                    editingId
                        ? "Employee updated successfully!"
                        : "Employee added successfully!"
                );

                resetForm();

                fetchEmployees();

            } else {
                setMessage(
                    data.message ||
                    (
                        editingId
                            ? "Failed to update employee"
                            : "Failed to add employee"
                    )
                );
            }

        } catch (error) {
            setMessage("Unable to connect to backend");

        } finally {
            setLoading(false);
        }
    };

    // EDIT EMPLOYEE
    const handleEdit = (employee) => {
        setEditingId(employee._id);

        setForm({
            name: employee.name || "",
            email: employee.email || "",
            phone: employee.phone || "",
            role: employee.role || "",
            department: employee.department || "",
            joiningDate: employee.joiningDate
                ? employee.joiningDate.split("T")[0]
                : "",
            salary: employee.salary ?? "",
            status: employee.status || "Active"
        });

        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // DELETE EMPLOYEE
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setMessage("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/employees/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setMessage(
                    "Employee deleted successfully!"
                );

                if (editingId === id) {
                    resetForm();
                }

                fetchEmployees();

            } else {
                setMessage(
                    data.message ||
                    "Failed to delete employee"
                );
            }

        } catch (error) {
            setMessage(
                "Unable to connect to backend"
            );
        }
    };

    return (
        <div style={{ padding: "30px" }}>

            <h1>Employees</h1>

            <p>
                Manage employees and their information
            </p>

            {/* ADD / EDIT EMPLOYEE FORM - ADMIN ONLY */}

            {isAdmin && (
                <div
                    style={{
                        marginTop: "25px",
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "10px"
                    }}
                >

                    <h2>
                        {editingId
                            ? "Edit Employee"
                            : "Add Employee"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, 1fr)",
                                gap: "15px",
                                marginTop: "15px"
                            }}
                        >

                            <input
                                type="text"
                                name="name"
                                placeholder="Employee Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="role"
                                placeholder="Role"
                                value={form.role}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="department"
                                placeholder="Department"
                                value={form.department}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="date"
                                name="joiningDate"
                                value={form.joiningDate}
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                name="salary"
                                placeholder="Salary"
                                value={form.salary}
                                onChange={handleChange}
                                min="0"
                            />

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>
                            </select>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: "20px",
                                padding: "10px 20px",
                                cursor: "pointer",
                                marginRight: "10px"
                            }}
                        >
                            {loading
                                ? editingId
                                    ? "Updating..."
                                    : "Adding..."
                                : editingId
                                    ? "Update Employee"
                                    : "Add Employee"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    marginTop: "20px",
                                    padding: "10px 20px",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                        )}

                    </form>

                </div>
            )}

            {/* MESSAGE */}

            {message && (
                <p
                    style={{
                        marginTop: "15px",
                        fontWeight: "bold"
                    }}
                >
                    {message}
                </p>
            )}

            {/* SEARCH AND FILTERS */}

            <div
                style={{
                    marginTop: "30px",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "10px"
                }}
            >

                <h2>Search & Filter Employees</h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "2fr 1fr 1fr",
                        gap: "15px",
                        marginTop: "15px"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Search by name or email"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <select
                        value={department}
                        onChange={(e) =>
                            setDepartment(e.target.value)
                        }
                    >
                        <option value="">
                            All Departments
                        </option>

                        <option value="IT">
                            IT
                        </option>

                        <option value="HR">
                            HR
                        </option>

                        <option value="Finance">
                            Finance
                        </option>

                        <option value="Sales">
                            Sales
                        </option>

                        <option value="Marketing">
                            Marketing
                        </option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >
                        <option value="">
                            All Status
                        </option>

                        <option value="Active">
                            Active
                        </option>

                        <option value="Inactive">
                            Inactive
                        </option>
                    </select>

                </div>

            </div>

            {/* EMPLOYEE LIST */}

            <div style={{ marginTop: "30px" }}>

                <h2>
                    Employee List{" "}
                    ({employees.length})
                </h2>

                {employees.length === 0 ? (

                    <p>
                        No employees found.
                    </p>

                ) : (

                    <div
                        style={{
                            overflowX: "auto",
                            marginTop: "15px"
                        }}
                    >

                        <table
                            border="1"
                            cellPadding="10"
                            style={{
                                width: "100%",
                                borderCollapse:
                                    "collapse"
                            }}
                        >

                            <thead>

                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Joining Date</th>
                                    <th>Salary</th>
                                    <th>Status</th>

                                    {isAdmin && (
                                        <th>Actions</th>
                                    )}

                                </tr>

                            </thead>

                            <tbody>

                                {employees.map(
                                    (employee) => (

                                        <tr
                                            key={
                                                employee._id
                                            }
                                        >

                                            <td>
                                                {
                                                    employee.name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    employee.email
                                                }
                                            </td>

                                            <td>
                                                {
                                                    employee.phone ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    employee.role
                                                }
                                            </td>

                                            <td>
                                                {
                                                    employee.department
                                                }
                                            </td>

                                            <td>
                                                {employee.joiningDate
                                                    ? new Date(
                                                        employee.joiningDate
                                                    ).toLocaleDateString()
                                                    : "-"
                                                }
                                            </td>

                                            <td>
                                                {employee.salary !==
                                                undefined &&
                                                employee.salary !==
                                                null
                                                    ? `₹${employee.salary}`
                                                    : "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    employee.status
                                                }
                                            </td>

                                            {isAdmin && (
                                                <td>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                employee
                                                            )
                                                        }
                                                        style={{
                                                            marginRight:
                                                                "8px",
                                                            padding:
                                                                "6px 12px",
                                                            cursor:
                                                                "pointer"
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                employee._id
                                                            )
                                                        }
                                                        style={{
                                                            padding:
                                                                "6px 12px",
                                                            cursor:
                                                                "pointer"
                                                        }}
                                                    >
                                                        Delete
                                                    </button>

                                                </td>
                                            )}

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
};

export default Employees;