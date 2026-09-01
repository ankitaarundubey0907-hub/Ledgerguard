const bcrypt = require("bcryptjs");
const Tenant = require("../models/tenant");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const registerUser=async({companyName,name,email,password})=>{

    const existingUser=await User.findOne({email});

     if (existingUser) {
        throw new Error("User already exists");
    }

    const tenant = await Tenant.create({
        name: companyName,
        databaseName: `tenant_${Date.now()}`
    });

    const hashedPassword=await bcrypt.hash(password,10);

    const user=await User.create({
        name,
        email,
        password:hashedPassword,
        tenantId:tenant._id,
        role:"admin"
    });

    return {
        tenant,
        user
    };
}

const loginUser = async ({ email, password }) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            userId: user._id,
            tenantId: user.tenantId,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        token,
        user
    };
};

module.exports = {
    registerUser,loginUser
};