import React, { useEffect, useState } from "react";

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
                setMessage(data.message || "Failed to load employees");
            }

        } catch (error) {
            setMessage("Unable to connect to backend");
        }
    };


    useEffect(() => {
        fetchEmployees();
    }, [search, department, status]);


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            console.log("TOKEN:", token);

            const response = await fetch(
                "http://localhost:5000/api/employees",
                {
                    method: "POST",

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
                }
            );

            const data = await response.json();

            if (data.success) {

                setMessage("Employee added successfully!");

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

                fetchEmployees();

            } else {
                setMessage(
                    data.message || "Failed to add employee"
                );
            }

        } catch (error) {
            setMessage("Unable to connect to backend");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ padding: "30px" }}>

            <h1>Employees</h1>

            <p>
                Manage employees and their information
            </p>


            {/* Add Employee Form */}

            <div
                style={{
                    marginTop: "25px",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "10px"
                }}
            >

                <h2>Add Employee</h2>

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
                            cursor: "pointer"
                        }}
                    >
                        {loading
                            ? "Adding..."
                            : "Add Employee"}
                    </button>

                </form>

            </div>


            {/* Message */}

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


            {/* Search and Filters */}

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


            {/* Employee List */}

            <div style={{ marginTop: "30px" }}>

                <h2>
                    Employee List
                    {" "}
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