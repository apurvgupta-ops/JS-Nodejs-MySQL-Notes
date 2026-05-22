package oops;

public class Encapsulation {
    public static void main(String[] args) {
        SportCars myCar = new SportCars("Nissan", "Micra");
        myCar.startEngine();
        myCar.shiftGear(1);
        myCar.accelerate();
        myCar.shiftGear(2);
        myCar.accelerate();
        myCar.brake();
        myCar.stopEngine();

    }
}

class SportCars {
    private String brand;
    private String model;
    private boolean isEngineOn = false;
    private int currentSpeed;
    private int currentGear;

    private String tyreCompany;

    public SportCars(String brand, String model) {
        this.brand = brand;
        this.model = model;
    }

    public String getTyreCompany() {
        return tyreCompany;
    }

    public void setTyreCompany(String tyreCompany) {
        this.tyreCompany = tyreCompany;
    }

    public void startEngine() {
        if (!isEngineOn) {
            isEngineOn = true;
            System.out.println(brand + " " + model + " : Engine starts with a roar!");
        } else {
            System.out.println(brand + " " + model + " : Engine is already running.");
        }
    }

    public void shiftGear(int gear) {
        // Fix: Properly guard against shifting when the engine is off
        if (!isEngineOn) {
            System.out.println(brand + " " + model + " : Engine is off! Cannot shift gear.");
            return;
        }

        this.currentGear = gear;
        System.out.println(brand + " " + model + " : Shifted to gear " + currentGear);
    }

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

    public void brake() {
        // You can brake even if the engine dies while rolling
        currentSpeed -= 20;
        if (currentSpeed < 0) {
            currentSpeed = 0;
        }
        System.out.println(brand + " " + model + " : Braking! Speed is now " + currentSpeed + " km/h");
    }

    public void stopEngine() {
        isEngineOn = false;
        currentGear = 0;
        currentSpeed = 0;
        System.out.println(brand + " " + model + " : Engine turned off.");
    }
}
