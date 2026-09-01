const mongoose=require("mongoose")

const tenantScheme=new mongoose.Schema({
    name:{
    type:String,
    required:true,
    trim:true
},
    databaseName:{
         type: String,
            required: true,
            unique: true,
            trim: true
    }
},
{
timestamps:true
});