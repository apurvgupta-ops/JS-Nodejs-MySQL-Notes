package DesignPatterns.FactoryDesign;

// This is a simple implementation of the Abstract Factory Design Pattern in Java. The Abstract Factory Design Pattern is a creational design pattern that provides an interface for creating families of related or dependent objects without specifying their concrete classes.
// Interface of Burger
interface Burger {

    void prepare();
}

// Interface of Garlic Bread
interface GarlicBread {

    void prepare();
}
// Concrete classes of Burger

class BasicBurger implements Burger {

    @Override
    public void prepare() {
        System.out.println("Preapring Basic Burger");
    }
}

class StandardBurger implements Burger {

    @Override
    public void prepare() {
        System.out.println("Preapring Standard Burger");
    }
}

class PremiumBurger implements Burger {

    @Override
    public void prepare() {
        System.out.println("Preapring Preminum Burger");
    }
}

class BasicWheatBurger implements Burger {

    @Override
    public void prepare() {
        System.out.println("Preparing Basic Wheat Burger with bun, patty, and ketchup!");
    }
}

class StandardWheatBurger implements Burger {

    @Override
    public void prepare() {
        System.out.println("Preparing Standard Wheat Burger with bun, patty, cheese, and lettuce!");
    }
}

class PremiumWheatBurger implements Burger {

    @Override
    public void prepare() {
        System.out.println("Preparing Premium Wheat Burger with gourmet bun, premium patty, cheese, lettuce, and secret sauce!");
    }
}

// Concrete Classes of Garlic Bread
class BasicGarlicBread implements GarlicBread {

    @Override
    public void prepare() {
        System.out.println("Preapring Basic GarlicBread");
    }
}

class StandardGarlicBread implements GarlicBread {

    @Override
    public void prepare() {
        System.out.println("Preapring Standard GarlicBread");
    }
}

class PremiumGarlicBread implements GarlicBread {

    @Override
    public void prepare() {
        System.out.println("Preapring Preminum GarlicBread");
    }
}

class BasicWheatGarlicBread implements GarlicBread {

    @Override
    public void prepare() {
        System.out.println("Preparing Basic Wheat GarlicBread with bun, patty, and ketchup!");
    }
}

class StandardWheatGarlicBread implements GarlicBread {

    @Override
    public void prepare() {
        System.out.println("Preparing Standard Wheat GarlicBread with bun, patty, cheese, and lettuce!");
    }
}

class PremiumWheatGarlicBread implements GarlicBread {

    @Override
    public void prepare() {
        System.out.println("Preparing Premium Wheat GarlicBread with gourmet bun, premium patty, cheese, lettuce, and secret sauce!");
    }
}

// Factory Interface and Concrete Factories (composite factory and has-a relationship)
interface MealFactory {

    Burger createBurger(String type);

    GarlicBread createGarlicBread(String type);
}
// Concrete Classes

class SinghBurger implements MealFactory {

    @Override
    public Burger createBurger(String type) {
        if (type.equalsIgnoreCase("basic")) {
            return new BasicBurger();
        } else if (type.equalsIgnoreCase("standard")) {
            return new StandardBurger();
        } else if (type.equalsIgnoreCase("premium")) {
            return new PremiumBurger();
        } else {
            System.out.println("Invalid burger type!");
            return null;
        }
    }

    @Override
    public GarlicBread createGarlicBread(String type) {
        if (type.equalsIgnoreCase("basic")) {
            return new BasicGarlicBread();
        } else if (type.equalsIgnoreCase("standard")) {
            return new StandardGarlicBread();
        } else if (type.equalsIgnoreCase("premium")) {
            return new PremiumGarlicBread();
        } else {
            System.out.println("Invalid garlic bread type!");
            return null;
        }
    }
}

class KingBurger implements MealFactory {

    @Override
    public Burger createBurger(String type) {
        if (type.equalsIgnoreCase("basic")) {
            return new BasicWheatBurger();
        } else if (type.equalsIgnoreCase("standard")) {
            return new StandardWheatBurger();
        } else if (type.equalsIgnoreCase("premium")) {
            return new PremiumWheatBurger();
        } else {
            System.out.println("Invalid burger type!");
            return null;
        }
    }

    @Override
    public GarlicBread createGarlicBread(String type) {
        if (type.equalsIgnoreCase("basic")) {
            return new BasicWheatGarlicBread();
        } else if (type.equalsIgnoreCase("standard")) {
            return new StandardWheatGarlicBread();
        } else if (type.equalsIgnoreCase("premium")) {
            return new PremiumWheatGarlicBread();
        } else {
            System.out.println("Invalid garlic bread type!");
            return null;
        }
    }
}

public class AbstractMethodDesign {

    public static void main(String[] args) {
        String burgertype = "basic";
        String GarlicString = "standard";
        MealFactory myFactory = new KingBurger();
        Burger burger = myFactory.createBurger(burgertype);
        GarlicBread bread = myFactory.createGarlicBread(GarlicString);

        if (burger != null) {
            burger.prepare();
        }
        if (bread != null) {
            bread.prepare();
        }
    }
}
