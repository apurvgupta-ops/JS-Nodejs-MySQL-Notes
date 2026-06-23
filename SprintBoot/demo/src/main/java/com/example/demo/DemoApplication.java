package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.demo.Notification.PopUpNotification;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);

        System.out.println("hello world");

        OrderService orderService = new OrderService(new PopUpNotification());
        orderService.placeOrder("Sample order details");
    }

}
