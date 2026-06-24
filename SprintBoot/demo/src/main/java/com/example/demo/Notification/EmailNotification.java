package com.example.demo.Notification;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
// @Primary
@Qualifier("email")
public class EmailNotification implements NotificationInterface {
    @Override
    public void sendNotification(String message) {
        System.out.println("Sending email notification: " + message);
    }

}
