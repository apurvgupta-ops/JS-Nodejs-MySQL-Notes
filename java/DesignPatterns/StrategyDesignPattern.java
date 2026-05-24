package DesignPatterns;

// Strategy Design Pattern is a behavioral design pattern that enables selecting an algorithm's behavior at runtime. It defines a family of algorithms, encapsulates each one, and makes them interchangeable. This pattern allows the algorithm to vary independently from clients that use it.
// --- Strategy Interface for Walk ---
interface WalkableRobot {

    void walk();
}

// --- Concrete Strategies for walk ---
class NormalWalk implements WalkableRobot {

    @Override
    public void walk() {
        System.err.println("Normal walk robot");
    }
}

class NoWalk implements WalkableRobot {

    @Override
    public void walk() {
        System.out.println("No walk robot");
    }
}

// --- Strategy Interface for Talk ---
interface TalkableRobot {

    void talk();
}

// --- Concrete Strategies for talk ---
class NormalTalk implements TalkableRobot {

    @Override
    public void talk() {
        System.out.println("Normal Talk Robot");
    }
}

class NoTalk implements TalkableRobot {

    @Override
    public void talk() {
        System.out.println("No Talk robot");
    }
}

// --- Strategy Interface for Fly ---
interface FlyableRobot {

    void fly();
}

// --- Concrete Strategies for fly ---
class NormalFly implements FlyableRobot {

    @Override
    public void fly() {
        System.out.println("Normal fly Robot");
    }
}

class NoFly implements FlyableRobot {

    @Override
    public void fly() {
        System.out.println("No fly robot");
    }
}

class FlyWithJet implements FlyableRobot {

    @Override
    public void fly() {
        System.out.println("Fly with jet robot");
    }
}

// --- Context class that uses the strategies --- Robot Base class that uses the strategies
abstract class Robot {

    protected WalkableRobot walkBehaviour;
    protected TalkableRobot talkBehaviour;
    protected FlyableRobot flyBehaviour;

    public Robot(WalkableRobot w, TalkableRobot t, FlyableRobot f) {
        this.walkBehaviour = w;
        this.talkBehaviour = t;
        this.flyBehaviour = f;
    }

    public void walk() {
        walkBehaviour.walk();
    }

    public void talk() {
        talkBehaviour.talk();
    }

    public void fly() {
        flyBehaviour.fly();
    }

    public abstract void projection();
}

// --- Concrete Robot classes that define specific robot types ---
class CompanionRobot extends Robot {

    public CompanionRobot(WalkableRobot w, TalkableRobot t, FlyableRobot f) {
        super(w, t, f);
    }

    @Override
    public void projection() {
        System.out.println("Displaying friendly companion features...");
    }
}

// --- Concrete Robot classes that define specific robot types ---
class WorkerRobot extends Robot {

    public WorkerRobot(WalkableRobot w, TalkableRobot t, FlyableRobot f) {
        super(w, t, f);
    }

    @Override
    public void projection() {
        System.out.println("Displaying worker efficiency stats...");
    }
}

// --- Client code to demonstrate the Strategy Design Pattern ---
public class StrategyDesignPattern {

    public static void main(String[] args) {
        Robot robot1 = new CompanionRobot(new NormalWalk(), new NormalTalk(), new FlyWithJet());
        robot1.walk();
        robot1.talk();
        robot1.fly();
        robot1.projection();

        System.out.println("--------------------");

        Robot robot2 = new WorkerRobot(new NoWalk(), new NoTalk(), new NoFly());
        robot2.walk();
        robot2.talk();
        robot2.fly();
        robot2.projection();

    }
}
