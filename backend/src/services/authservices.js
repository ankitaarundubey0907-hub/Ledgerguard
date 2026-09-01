const bcrypt = require("bcryptjs");
const Tenant = require("../models/tenant");
const User = require("../models/user");


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
module.exports = {
    registerUser
};