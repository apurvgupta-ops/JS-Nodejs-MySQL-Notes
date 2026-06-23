package com.example.demo;

import com.example.demo.Notification.NotificationInterface;

public class OrderService {
    private NotificationInterface notification;

    public OrderService(NotificationInterface notification) {
        this.notification = notification;
    }

    public String placeOrder(String orderDetails) {
        // Logic to place the order
        String orderId = "12345"; // Simulated order ID

        // Notify the user about the order placement
        notification.sendNotification("Order placed successfully. Order ID: " + orderId);

        return orderId;
    }
}
