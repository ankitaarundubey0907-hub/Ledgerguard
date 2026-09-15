const Employee = require("../models/employee");

// CREATE EMPLOYEE
const createEmployee = async(req, res) => {
    try {
        const {
            name,
            email,
            phone,
            role,
            department,
            joiningDate,
            salary,
            status
        } = req.body;

        if (!name || !email || !role || !department) {
            return res.status(400).json({
                success: false,
                message: "Name, email, role and department are required"
            });
        }

        const employee = await Employee.create({
            name,
            email,
            phone,
            role,
            department,
            joiningDate,
            salary,
            status,
            tenantId: req.user.tenantId
        });

        const io = req.app.get("io");

        io.to(`tenant:${req.user.tenantId}`).emit(
            "employeeAdded",
            employee
        );

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: employee
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET / SEARCH / FILTER EMPLOYEES
const getEmployees = async(req, res) => {
    try {
        const { search, department, status } = req.query;

        const filter = {
            tenantId: req.user.tenantId
        };

        if (search) {
            filter.$or = [{
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (department) {
            filter.department = department;
        }

        if (status) {
            filter.status = status;
        }

        const employees = await Employee.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE EMPLOYEE
const updateEmployee = async(req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            phone,
            role,
            department,
            joiningDate,
            salary,
            status
        } = req.body;

        const employee = await Employee.findOne({
            _id: id,
            tenantId: req.user.tenantId
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        employee.name = name;
        employee.email = email;
        employee.phone = phone;
        employee.role = role;
        employee.department = department;
        employee.joiningDate = joiningDate;
        employee.salary = salary;
        employee.status = status;

        await employee.save();

        const io = req.app.get("io");

        io.to(`tenant:${req.user.tenantId}`).emit(
            "employeeUpdated",
            employee
        );

        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: employee
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE EMPLOYEE
const deleteEmployee = async(req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findOneAndDelete({
            _id: id,
            tenantId: req.user.tenantId
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const io = req.app.get("io");

        io.to(`tenant:${req.user.tenantId}`).emit(
            "employeeDeleted",
            employee._id.toString()
        );

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee
};