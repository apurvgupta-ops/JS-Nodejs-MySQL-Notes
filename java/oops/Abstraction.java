package oops;

interface Cars {
    void startEngine();

    void shiftGear(int gear);

    void accelerate();

    void brake();

    void stopEngine();
}

class SportCars implements Cars {
    String brand;
    String model;
    boolean isEngineOn = false;
    int currentSpeed;
    int currentGear;

    public SportCars(String brand, String model) {
        this.brand = brand;
        this.model = model;
    }

    @Override
    public void startEngine() {
        if (!isEngineOn) {
            isEngineOn = true;
            System.out.println(brand + " " + model + " : Engine starts with a roar!");
        } else {
            System.out.println(brand + " " + model + " : Engine is already running.");
        }
    }

    @Override
    public void shiftGear(int gear) {
        // Fix: Properly guard against shifting when the engine is off
        if (!isEngineOn) {
            System.out.println(brand + " " + model + " : Engine is off! Cannot shift gear.");
            return;
        }

        currentGear = gear;
        System.out.println(brand + " " + model + " : Shifted to gear " + currentGear);
    }

    @Override
    public void accelerate() {
        if (!isEngineOn) {
            System.out.println(brand + " " + model + " : Engine is off! Cannot accelerate.");
            return;
        }
        // Basic safety: Don't accelerate in Neutral (Gear 0)
        if (currentGear == 0) {
            System.out.println(brand + " " + model + " : Engine revs in Neutral! Shift gear to move.");
            return;
        }

        currentSpeed += 20;
        System.out.println(brand + " " + model + " : Accelerating to " + currentSpeed + " km/h");
    }

    @Override
    public void brake() {
        // You can brake even if the engine dies while rolling
        currentSpeed -= 20;
        if (currentSpeed < 0) {
            currentSpeed = 0;
        }
        System.out.println(brand + " " + model + " : Braking! Speed is now " + currentSpeed + " km/h");
    }

    @Override
    public void stopEngine() {
        isEngineOn = false;
        currentGear = 0;
        currentSpeed = 0;
        System.out.println(brand + " " + model + " : Engine turned off.");
    }
}

public class Abstraction {
    public static void main(String[] args) {
        Cars myCar = new SportCars("Ford", "Mustang");

        myCar.startEngine();
        myCar.shiftGear(1);
        myCar.accelerate();
        myCar.shiftGear(2);
        myCar.brake();
        myCar.stopEngine();
    }
}