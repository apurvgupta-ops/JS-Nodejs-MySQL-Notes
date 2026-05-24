// package DesignPatterns.FactoryDesign;

// // This is a simple implementation of the Factory Design Pattern in Java. The Factory Design Pattern is a creational design pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.
// // Interface of Burger
// interface Burger {

//     void prepare();
// }

// // Concrete classes
// class BasicBurger implements Burger {

//     @Override
//     public void prepare() {
//         System.out.println("Preapring Basic Burger");
//     }
// }

// class StandardBurger implements Burger {

//     @Override
//     public void prepare() {
//         System.out.println("Preapring Standard Burger");
//     }
// }

// class PremiumBurger implements Burger {

//     @Override
//     public void prepare() {
//         System.out.println("Preapring Preminum Burger");
//     }
// }

// //  Base Class
// class BurgerFactory {

//     public Burger createBurger(String type) {
//         if (type.equalsIgnoreCase("basic")) {
//             return new BasicBurger();
//         } else if (type.equalsIgnoreCase("standard")) {
//             return new StandardBurger();
//         } else if (type.equalsIgnoreCase("premium")) {
//             return new PremiumBurger();
//         } else {
//             System.out.println("Invalid burger type!");
//             return null;
//         }
//     }
// }

// public class SimpleDesignPattern {

//     public static void main(String[] args) {
//         String type = "basic";

//         BurgerFactory myBurgerFactory = new BurgerFactory();

//         Burger burger = myBurgerFactory.createBurger(type);

//         if (burger != null) {
//             burger.prepare();
//         }

//     }
// }
