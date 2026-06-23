package com.example.demo.Notification;

public class SmsNotification implements NotificationInterface {
    @Override
    public void sendNotification(String message) {
        System.out.println("Sending SMS notification: " + message);
    }

}
