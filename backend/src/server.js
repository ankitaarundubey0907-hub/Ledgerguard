const express=require("express")
const dotenv=require("dotenv")
const connectDB = require("./config/db");
dotenv.config()


const app=express()
app.use(express.json())

connectDB();

app.get("/health",(req,res)=>{
   res.json({
        success: true,
        message: "LedgerGuard backend is running"
    });  
})
const port= process.env.port || 5000;

app.listen(port,()=>{
    console.log(`LedgerGuard server running on port ${port}`);
});
