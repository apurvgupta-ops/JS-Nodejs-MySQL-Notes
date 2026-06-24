package com.example.demo;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan()
public class AppConfig {
    // empty
    // Here i can define beans if needed, but currently, we are using component
    // scanning to automatically detect and register beans.

}
