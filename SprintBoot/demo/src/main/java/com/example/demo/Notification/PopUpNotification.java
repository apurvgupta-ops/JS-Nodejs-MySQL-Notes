package com.example.demo.Notification;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
@Qualifier("popup")
public class PopUpNotification implements NotificationInterface {
    @Override
    public void sendNotification(String message) {
        System.out.println("Sending pop-up notification: " + message);
    }

}
