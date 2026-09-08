const Employee = require("../models/employee");

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


const getEmployees = async(req, res) => {
    try {
        const { search, department, status } = req.query;

        const filter = {
            tenantId: req.user.tenantId
        };

        // Search by name or email
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

        // Filter by department
        if (department) {
            filter.department = department;
        }

        // Filter by status
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


module.exports = {
    createEmployee,
    getEmployees
};