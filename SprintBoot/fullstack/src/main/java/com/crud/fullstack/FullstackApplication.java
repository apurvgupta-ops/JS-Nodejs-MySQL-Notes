package com.crud.fullstack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

// @SpringBootApplication(exclude = DataSourceAutoConfiguration.class) // Exclude DataSourceAutoConfiguration to avoid
// database configuration issues

@SpringBootApplication
public class FullstackApplication {

    public static void main(String[] args) {
        SpringApplication.run(FullstackApplication.class, args);
        System.out.println("Server is running on port 8080");
    }

}
