const AuditLog = require("../models/auditlog");

const createAuditLog = async ({
    userId,
    tenantId,
    action,
    resourceType,
    resourceId = null,
    details = "",
    ipAddress = null
}) => {
    try {
        const auditLog = await AuditLog.create({
            userId,
            tenantId,
            action,
            resourceType,
            resourceId,
            details,
            ipAddress
        });

        return auditLog;
    } catch (error) {
        console.error(
            "Audit log error:",
            error.message
        );

        // Audit logging should not break the main
        // financial operation.
        return null;
    }
};

module.exports = {
    createAuditLog
};