// const Transaction = require("../models/transaction");
// const {
//     createTransaction: createTransactionService,
//     getTransactions: getTransactionsService,
//     updateTransaction: updateTransactionService,
//     deleteTransaction: deleteTransactionService,
//     getFinancialSummary: getFinancialSummaryService,
//     getFinancialReport: getFinancialReportService
// } = require("../services/transactionservices");

// const { redisClient } = require("../config/redis");
// const createTransaction = async (req, res) => {
//     try {
//         const { type, amount, description, category } = req.body;

//         if (!type || !amount || !description || !category) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }

//         const transaction = await Transaction.create({
//             type,
//             amount,
//             description,
//             category,
//             userId: req.user.userId,
//             tenantId: req.user.tenantId
//         });

//         res.status(201).json({
//             success: true,
//             message: "Transaction created successfully",
//             data: transaction
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// const getTransactions = async (req, res) => {
//     try {
//         const {
//             type,
//             category,
//             startDate,
//             endDate,
//             page = 1,
//             limit = 10
//         } = req.query;

//         const pageNumber = Math.max(parseInt(page), 1);
//         const limitNumber = Math.min(
//             Math.max(parseInt(limit), 1),
//             100
//         );

//         // Create a unique cache key for this tenant and query
//         const cacheKey = `transactions:${req.user.tenantId}:${JSON.stringify({
//             type,
//             category,
//             startDate,
//             endDate,
//             page: pageNumber,
//             limit: limitNumber
//         })}`;

//         // Check Redis first
//         const cachedData = await redisClient.get(cacheKey);

//         if (cachedData) {
//             console.log("Transactions served from Redis");

//             return res.status(200).json({
//                 success: true,
//                 ...JSON.parse(cachedData)
//             });
//         }

//         console.log("Transactions served from MongoDB");

//         const filter = {
//             tenantId: req.user.tenantId
//         };

//         if (type) {
//             filter.type = type;
//         }

//         if (category) {
//             filter.category = category;
//         }

//         if (startDate || endDate) {
//             filter.createdAt = {};

//             if (startDate) {
//                 filter.createdAt.$gte = new Date(startDate);
//             }

//             if (endDate) {
//                 const end = new Date(endDate);
//                 end.setHours(23, 59, 59, 999);
//                 filter.createdAt.$lte = end;
//             }
//         }

//         const skip = (pageNumber - 1) * limitNumber;

//         const totalTransactions =
//             await Transaction.countDocuments(filter);

//         const transactions = await Transaction.find(filter)
//             .populate("userId", "name email role")
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limitNumber);

//         const totalPages = Math.ceil(
//             totalTransactions / limitNumber
//         );

//         const responseData = {
//             count: transactions.length,
//             pagination: {
//                 currentPage: pageNumber,
//                 limit: limitNumber,
//                 totalTransactions,
//                 totalPages,
//                 hasNextPage: pageNumber < totalPages,
//                 hasPreviousPage: pageNumber > 1
//             },
//             data: transactions
//         };

//         // Store result in Redis for 60 seconds
//         await redisClient.setEx(
//             cacheKey,
//             60,
//             JSON.stringify(responseData)
//         );

//         res.status(200).json({
//             success: true,
//             ...responseData
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// const updateTransaction=async(req,res)=>{
//     try{
//     const {id}= req.params;
//      const { type, amount, description, category,date } = req.body;
//      const tenantId=req.user.tenantId;
//      const transaction=await Transaction.findOne({
//         _id: id,
//             tenantId: tenantId
//      });
//      if(!transaction){
//         return res.satus(404).json({
//              success: false,
//              message: "Transaction not found"
//         });
//      }
//           if (amount !== undefined) {
//             transaction.amount = amount;
//         }

//         if (type !== undefined) {
//             transaction.type = type;
//         }

//         if (category !== undefined) {
//             transaction.category = category;
//         }

//         if (description !== undefined) {
//             transaction.description = description;
//         }

//         if (date !== undefined) {
//             transaction.date = date;
//         }
//     await transaction.save();
//             res.status(200).json({
//             success: true,
//             message: "Transaction updated successfully",
//             data: transaction
//         });


// }
//     catch(error){
//  res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }

// }
// const deleteTransaction=async(req,res)=>{
//     try{
//       const {id}= req.params;
//      const tenantId=req.user.tenantId;
//      const transaction=await Transaction.findOne({
//         _id: id,
//             tenantId: tenantId
//      });
//       if(!transaction){
//         return res.status(404).json({
//              success: false,
//              message: "Transaction not found"
//         });
//      }
//      await Transaction.deleteOne({
//         _id:id,
//         tenantId:tenanatId
//      });
//         res.status(200).json({
//             success: true,
//             message: "Transaction deleted successfully"
//         });
//     }
//     catch(error){
//         res.status(500).json({
//             success:false,
//             message:error.message
//         })

//     }
// }
// const getFinancialSummary = async (req, res) => {
//     try {
//         const summary = await getFinancialSummaryService(
//             req.user.tenantId
//         );

//         res.status(200).json({
//             success: true,
//             data: summary
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// const getFinancialReport = async (req, res) => {
//     try {
//         const { startDate, endDate } = req.query;

//         const report = await getFinancialReportService(
//             req.user.tenantId,
//             startDate,
//             endDate
//         );

//         res.status(200).json({
//             success: true,
//             data: report
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };
// module.exports = {
//     createTransaction,
//     getTransactions,
//     updateTransaction,
//     deleteTransaction,
//     getFinancialSummary,
//     getFinancialReport
// };



const Transaction = require("../models/transaction");

const {
    createTransaction: createTransactionService,
    getTransactions: getTransactionsService,
    updateTransaction: updateTransactionService,
    deleteTransaction: deleteTransactionService,
    getFinancialSummary: getFinancialSummaryService,
    getFinancialReport: getFinancialReportService
} = require("../services/transactionservices");

const { redisClient } = require("../config/redis");

const {
    encryptData,
    decryptData
} = require("../utils/encryption");

const {
    createAuditLog
} = require("../services/auditlogservices");

// ========================================
// CLEAR TRANSACTION CACHE
// ========================================
const clearTransactionCache = async (tenantId) => {
    try {
        const pattern = `transactions:${tenantId}:*`;

        const keys = [];

        for await (const key of redisClient.scanIterator({
            MATCH: pattern,
            COUNT: 100
        })) {
            keys.push(key);
        }

        if (keys.length > 0) {
            for (const key of keys) {
                await redisClient.sendCommand([
                    "DEL",
                    String(key)
                ]);
            }

            console.log("Transaction cache cleared");
        }

    } catch (error) {
        console.error(
            "Redis cache clear error:",
            error.message
        );
    }
};


// ========================================
// CREATE TRANSACTION
// ========================================

const createTransaction = async (req, res) => {
    try {

      const {
    type,
    amount,
    description,
    category,
    date,
    sensitiveData
} = req.body;

        if (
            !type ||
            amount === undefined ||
            !description ||
            !category
        ) {
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
            date,
            sensitiveData: sensitiveData
        ? encryptData(sensitiveData)
        : null,
            userId: req.user.userId,
            tenantId: req.user.tenantId
        });

        await createAuditLog({
    userId: req.user.userId,
    tenantId: req.user.tenantId,
    action: "CREATE_TRANSACTION",
    resourceType: "Transaction",
    resourceId: transaction._id,
    details: "Transaction created",
    ipAddress: req.ip
});

        // Clear old Redis cache
        await clearTransactionCache(
            req.user.tenantId
        );

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


// ========================================
// GET TRANSACTIONS
// ========================================

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


        // Pagination

        const pageNumber = Math.max(
            parseInt(page),
            1
        );

        const limitNumber = Math.min(
            Math.max(parseInt(limit), 1),
            100
        );


        // ========================================
        // REDIS CACHE KEY
        // ========================================

        const cacheKey =
            `transactions:${req.user.tenantId}:${JSON.stringify({
                type,
                category,
                startDate,
                endDate,
                page: pageNumber,
                limit: limitNumber
            })}`;


        // ========================================
        // CHECK REDIS CACHE
        // ========================================

        const cachedData =
            await redisClient.get(cacheKey);


        if (cachedData) {

            console.log(
                "Transactions served from Redis"
            );

            return res.status(200).json({
                success: true,
                ...JSON.parse(cachedData)
            });
        }


        console.log(
            "Transactions served from MongoDB"
        );


        // ========================================
        // MONGODB FILTER
        // ========================================

        const filter = {
            tenantId: req.user.tenantId
        };


        // Feature 2:
        // Type filtering

        if (type) {
            filter.type = type;
        }


        // Feature 2:
        // Category filtering

        if (category) {
            filter.category = category;
        }


        // Feature 3:
        // Date range filtering

        if (startDate || endDate) {

            filter.createdAt = {};

            if (startDate) {

                filter.createdAt.$gte =
                    new Date(startDate);
            }

            if (endDate) {

                const end =
                    new Date(endDate);

                end.setHours(
                    23,
                    59,
                    59,
                    999
                );

                filter.createdAt.$lte = end;
            }
        }


        // PAGINATION
       

        const skip =
            (pageNumber - 1) *
            limitNumber;


        const totalTransactions =
            await Transaction.countDocuments(
                filter
            );


        const transactions =
            await Transaction.find(filter)
                .populate(
                    "userId",
                    "name email role"
                )
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(limitNumber);


        const totalPages =
            Math.ceil(
                totalTransactions /
                limitNumber
            );


        
        // RESPONSE DATA
       

        const responseData = {

            count: transactions.length,

            pagination: {

                currentPage: pageNumber,

                limit: limitNumber,

                totalTransactions,

                totalPages,

                hasNextPage:
                    pageNumber < totalPages,

                hasPreviousPage:
                    pageNumber > 1
            },

            data: transactions
        };


       
        // SAVE RESULT TO REDIS
       

        await redisClient.setEx(
            cacheKey,
            60,
            JSON.stringify(responseData)
        );


        res.status(200).json({

            success: true,

            ...responseData
        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message
        });
    }
};



// UPDATE TRANSACTION

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            type,
            amount,
            description,
            category,
            date
        } = req.body;

        const tenantId = req.user.tenantId;

        const transaction = await Transaction.findOne({
            _id: id,
            tenantId: tenantId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        // Update only fields that were provided
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

        // Create audit log
        await createAuditLog({
            userId: req.user.userId,
            tenantId: req.user.tenantId,
            action: "UPDATE_TRANSACTION",
            resourceType: "Transaction",
            resourceId: transaction._id,
            details: "Transaction updated",
            ipAddress: req.ip
        });

        res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            data: transaction
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE TRANSACTION

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const tenantId = req.user.tenantId;

        const transaction = await Transaction.findOne({
            _id: id,
            tenantId: tenantId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        await Transaction.deleteOne({
            _id: id,
            tenantId: tenantId
        });

        // Create audit log AFTER successful deletion
        await createAuditLog({
            userId: req.user.userId,
            tenantId: req.user.tenantId,
            action: "DELETE_TRANSACTION",
            resourceType: "Transaction",
            resourceId: transaction._id,
            details: "Transaction deleted",
            ipAddress: req.ip
        });

        res.status(200).json({
            success: true,
            message: "Transaction deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// FINANCIAL SUMMARY


const getFinancialSummary = async (req, res) => {
    try {

        const summary =
            await getFinancialSummaryService(
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



// FINANCIAL REPORT


const getFinancialReport = async (req, res) => {
    try {

        const {
            startDate,
            endDate
        } = req.query;


        const report =
            await getFinancialReportService(
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