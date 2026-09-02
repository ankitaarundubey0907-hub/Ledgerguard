const express=require("express")
const dotenv=require("dotenv")
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const transactionRoutes = require("./routes/transactionroutes");
const cors = require("cors");

dotenv.config()


const app=express();
app.use(cors());
app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

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
