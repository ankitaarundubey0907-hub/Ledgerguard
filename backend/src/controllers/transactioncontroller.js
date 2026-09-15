const Transaction = require("../models/transaction");
const {
    createTransaction: createTransactionService,
    getTransactions: getTransactionsService,
    updateTransaction: updateTransactionService,
    deleteTransaction: deleteTransactionService,
    getFinancialSummary: getFinancialSummaryService,
    getFinancialReport: getFinancialReportService
} = require("../services/transactionservices");
const createTransaction = async (req, res) => {
    try {
        const { type, amount, description, category } = req.body;

        if (!type || !amount || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const transaction = await Transaction.create({
            type,
            amount,
            description,
            category,
            userId: req.user.userId,
            tenantId: req.user.tenantId
        });

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTransactions = async (req, res) => {
    try {
        const {
            type,
            category,
            startDate,
            endDate,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {
            tenantId: req.user.tenantId
        };

        // Feature 2 filters
        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        // Feature 3: Date range filtering
        if (startDate || endDate) {
            filter.createdAt = {};

            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = end;
            }
        }

        // Pagination
        const pageNumber = Math.max(parseInt(page), 1);
        const limitNumber = Math.min(
            Math.max(parseInt(limit), 1),
            100
        );

        const skip = (pageNumber - 1) * limitNumber;

        const totalTransactions = await Transaction.countDocuments(filter);

        const transactions = await Transaction.find(filter)
            .populate("userId", "name email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        const totalPages = Math.ceil(
            totalTransactions / limitNumber
        );

        res.status(200).json({
            success: true,
            count: transactions.length,
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalTransactions,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1
            },
            data: transactions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateTransaction=async(req,res)=>{
    try{
    const {id}= req.params;
     const { type, amount, description, category,date } = req.body;
     const tenantId=req.user.tenantId;
     const transaction=await Transaction.findOne({
        _id: id,
            tenantId: tenantId
     });
     if(!transaction){
        return res.satus(404).json({
             success: false,
             message: "Transaction not found"
        });
     }
          if (amount !== undefined) {
            transaction.amount = amount;
        }

        if (type !== undefined) {
            transaction.type = type;
        }

        if (category !== undefined) {
            transaction.category = category;
        }

        if (description !== undefined) {
            transaction.description = description;
        }

        if (date !== undefined) {
            transaction.date = date;
        }
    await transaction.save();
            res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            data: transaction
        });


}
    catch(error){
 res.status(500).json({
            success: false,
            message: error.message
        });
    }

}
const deleteTransaction=async(req,res)=>{
    try{
      const {id}= req.params;
     const tenantId=req.user.tenantId;
     const transaction=await Transaction.findOne({
        _id: id,
            tenantId: tenantId
     });
      if(!transaction){
        return res.status(404).json({
             success: false,
             message: "Transaction not found"
        });
     }
     await Transaction.deleteOne({
        _id:id,
        tenantId:tenanatId
     });
        res.status(200).json({
            success: true,
            message: "Transaction deleted successfully"
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })

    }
}
const getFinancialSummary = async (req, res) => {
    try {
        const summary = await getFinancialSummaryService(
            req.user.tenantId
        );

        res.status(200).json({
            success: true,
            data: summary
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getFinancialReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const report = await getFinancialReportService(
            req.user.tenantId,
            startDate,
            endDate
        );

        res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getFinancialSummary,
    getFinancialReport
};