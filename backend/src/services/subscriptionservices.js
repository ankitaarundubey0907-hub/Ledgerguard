const Subscription = require("../models/subscription");

const createSubscription = async ({
    tenantId,
    plan,
    amount,
    razorpayOrderId,
    razorpayPaymentId
}) => {

    const startDate = new Date();

    const endDate = new Date(startDate);

    if (plan === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
    }

    if (plan === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1);
    }

    if (plan === "trial") {
        endDate.setDate(endDate.getDate() + 3);
    }

    const subscription = await Subscription.create({
        tenantId,
        plan,
        amount,
        status: "active",
        startDate,
        endDate,
        razorpayOrderId,
        razorpayPaymentId
    });

    return subscription;
};


const getCurrentSubscription = async (tenantId) => {

    const subscription = await Subscription.findOne({
        tenantId,
        status: "active"
    }).sort({ createdAt: -1 });

    return subscription;
};


const cancelSubscription = async (tenantId) => {

    const subscription = await Subscription.findOne({
        tenantId,
        status: "active"
    }).sort({ createdAt: -1 });

    if (!subscription) {
        return null;
    }

    subscription.status = "cancelled";

    await subscription.save();

    return subscription;
};


module.exports = {
    createSubscription,
    getCurrentSubscription,
    cancelSubscription
};