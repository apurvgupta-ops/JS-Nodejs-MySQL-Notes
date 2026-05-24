// package DesignPatterns.FactoryDesign;

// // This is a simple implementation of the Factory Method Design Pattern in Java. The Factory Method Design Pattern is a creational design pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.
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

// class BasicWheatBurger implements Burger {

//     @Override
//     public void prepare() {
//         System.out.println("Preparing Basic Wheat Burger with bun, patty, and ketchup!");
//     }
// }

// class StandardWheatBurger implements Burger {

//     @Override
//     public void prepare() {
//         System.out.println("Preparing Standard Wheat Burger with bun, patty, cheese, and lettuce!");
//     }
// }

// class PremiumWheatBurger implements Burger {

//     @Override
//     public void prepare() {
//         System.out.println("Preparing Premium Wheat Burger with gourmet bun, premium patty, cheese, lettuce, and secret sauce!");
//     }
// }

// // Factory Interface and Concrete Factories
// interface BurgerFactory {

//     Burger createBurger(String type);
// }

// // Concrete Classes
// class SinghBurger implements BurgerFactory {

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

// class KingBurger implements BurgerFactory {

//     public Burger createBurger(String type) {
//         if (type.equalsIgnoreCase("basic")) {
//             return new BasicWheatBurger();
//         } else if (type.equalsIgnoreCase("standard")) {
//             return new StandardWheatBurger();
//         } else if (type.equalsIgnoreCase("premium")) {
//             return new PremiumWheatBurger();
//         } else {
//             System.out.println("Invalid burger type!");
//             return null;
//         }
//     }
// }

// public class FactoryMethodDesign {

//     public static void main(String[] args) {
//         String type = "basic";
//         BurgerFactory myFactory = new KingBurger();
//         Burger burger = myFactory.createBurger(type);

//         if (burger != null) {
//             burger.prepare();
//         }
//     }
// }
