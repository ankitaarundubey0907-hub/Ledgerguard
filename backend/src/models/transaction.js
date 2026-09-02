const mongoose=require("mongoose")

const transactionSchema =new mongoose.Schema(
    {
        type:{
            type:String,
             enum: ["income", "expense"],
            required: true
        },
           amount: {
            type: Number,
            required: true,
            min: 0
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        tenantId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Tenant",
            required:true
        }
    },
    {
        timestamps:true
    }

    
);
module.exports=mongoose.model("Transaction",transactionSchema);