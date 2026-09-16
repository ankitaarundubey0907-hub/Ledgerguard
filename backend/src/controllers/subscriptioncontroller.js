const {
    createSubscription: createSubscriptionService,
    getCurrentSubscription: getCurrentSubscriptionService,
    cancelSubscription: cancelSubscriptionService
} = require("../services/subscriptionservices");


const createSubscription = async (req, res) => {
    try {
        const {
            plan,
            amount,
            razorpayOrderId,
            razorpayPaymentId
        } = req.body;

        if (!plan || amount === undefined) {
            return res.status(400).json({
                success: false,
                message: "Plan and amount are required"
            });
        }

        const subscription = await createSubscriptionService({
            tenantId: req.user.tenantId,
            plan,
            amount,
            razorpayOrderId,
            razorpayPaymentId
        });

        res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            data: subscription
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getCurrentSubscription = async (req, res) => {
    try {
        const subscription = await getCurrentSubscriptionService(
            req.user.tenantId
        );

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "No active subscription found"
            });
        }

        res.status(200).json({
            success: true,
            data: subscription
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const cancelSubscription = async (req, res) => {
    try {
        const subscription = await cancelSubscriptionService(
            req.user.tenantId
        );

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "No active subscription found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully",
            data: subscription
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createSubscription,
    getCurrentSubscription,
    cancelSubscription
};