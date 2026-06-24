package com.example.demo.Notification;

public class PopUpNotification implements NotificationInterface {
    @Override
    public void sendNotification(String message) {
        System.out.println("Sending pop-up notification: " + message);
    }

}
