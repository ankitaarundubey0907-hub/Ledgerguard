
import React, { useEffect, useState } from "react";
import socket from "../services/socket";

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Welcome to LedgerGuard",
            message: "Your notification system is now active.",
            type: "system",
            read: false,
            time: "Just now"
        },
        {
            id: 2,
            title: "Employee Management",
            message: "Employee notifications are enabled.",
            type: "info",
            read: false,
            time: "Today"
        }
    ]);

    const addNotification = (title, message, type) => {
        const newNotification = {
            id: Date.now(),
            title: title,
            message: message,
            type: type,
            read: false,
            time: "Just now"
        };

        setNotifications((prev) => [
            newNotification,
            ...prev
        ]);
    };

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notification) => ({
                ...notification,
                read: true
            }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications((prev) =>
            prev.filter(
                (notification) => notification.id !== id
            )
        );
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    useEffect(() => {
        document.title = "Notifications | LedgerGuard";

        const handleEmployeeAdded = (employee) => {
            addNotification(
                "New Employee Added",
                `${employee.name} was added to the employee list.`,
                "employee"
            );
        };

        const handleEmployeeUpdated = (employee) => {
            addNotification(
                "Employee Updated",
                `${employee.name}'s information was updated.`,
                "employee"
            );
        };

        const handleEmployeeDeleted = () => {
            addNotification(
                "Employee Deleted",
                "An employee was removed from the employee list.",
                "employee"
            );
        };

        socket.on(
            "employeeAdded",
            handleEmployeeAdded
        );

        socket.on(
            "employeeUpdated",
            handleEmployeeUpdated
        );

        socket.on(
            "employeeDeleted",
            handleEmployeeDeleted
        );

        return () => {
            socket.off(
                "employeeAdded",
                handleEmployeeAdded
            );

            socket.off(
                "employeeUpdated",
                handleEmployeeUpdated
            );

            socket.off(
                "employeeDeleted",
                handleEmployeeDeleted
            );
        };
    }, []);

    return (
        <div style={{ padding: "30px" }}>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px"
                }}
            >

                <div>
                    <h1>Notifications</h1>

                    <p>
                        Stay updated with important LedgerGuard activities.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        style={{
                            padding: "10px 16px",
                            cursor: "pointer"
                        }}
                    >
                        Mark All as Read
                    </button>
                )}

            </div>

            <div
                style={{
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    marginBottom: "25px"
                }}
            >

                <h2>Notification Center</h2>

                <p>
                    Total Notifications: {notifications.length}
                </p>

                <p>
                    Unread Notifications: {unreadCount}
                </p>

            </div>

            {notifications.length === 0 ? (

                <div
                    style={{
                        padding: "40px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        borderRadius: "10px"
                    }}
                >

                    <h3>No Notifications</h3>

                    <p>
                        You are all caught up!
                    </p>

                </div>

            ) : (

                <div>

                    {notifications.map(
                        (notification) => (

                            <div
                                key={notification.id}
                                style={{
                                    padding: "20px",
                                    marginBottom: "15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    backgroundColor:
                                        notification.read
                                            ? "#f8f8f8"
                                            : "#eef6ff"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "flex-start"
                                    }}
                                >

                                    <div>

                                        <h3>
                                            {notification.title}
                                        </h3>

                                        <p>
                                            {notification.message}
                                        </p>

                                        <small>
                                            {notification.type.toUpperCase()}
                                            {" • "}
                                            {notification.time}
                                        </small>

                                    </div>

                                    <div>

                                        {!notification.read && (
                                            <button
                                                onClick={() =>
                                                    markAsRead(
                                                        notification.id
                                                    )
                                                }
                                                style={{
                                                    marginRight: "8px",
                                                    padding:
                                                        "7px 12px",
                                                    cursor:
                                                        "pointer"
                                                }}
                                            >
                                                Mark as Read
                                            </button>
                                        )}

                                        <button
                                            onClick={() =>
                                                deleteNotification(
                                                    notification.id
                                                )
                                            }
                                            style={{
                                                padding:
                                                    "7px 12px",
                                                cursor:
                                                    "pointer"
                                            }}
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
};

export default Notifications;
