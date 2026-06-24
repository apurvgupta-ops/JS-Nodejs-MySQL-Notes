package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.example.demo.Notification.NotificationInterface;

@Component
public class OrderService {
    private NotificationInterface notification;

    // @Autowired => In constructor injection, @Autowired is optional if there is
    // only one constructor
    public OrderService(@Qualifier("popup") NotificationInterface notification) {
        this.notification = notification;
    }

    public String placeOrder(String orderDetails) {
        String orderId = "12345";
        notification.sendNotification("Order placed successfully. Order ID: " + orderId);

        return orderId;
    }
}
