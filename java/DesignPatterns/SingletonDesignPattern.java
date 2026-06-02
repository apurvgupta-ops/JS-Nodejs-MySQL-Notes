package DesignPatterns;

public class SingletonDesignPattern {
    private static SingletonDesignPattern instance = null;

    private SingletonDesignPattern() {
        System.out.println("Contracture called");
    }

    public static SingletonDesignPattern getInstance() {
        synchronized (SingletonDesignPattern.class) {
            if (instance == null) {
                instance = new SingletonDesignPattern();
            }
        }

        return instance;
    }

    public static void main(String[] args) {
        SingletonDesignPattern s1 = SingletonDesignPattern.getInstance();
        SingletonDesignPattern s2 = SingletonDesignPattern.getInstance();

        System.out.print(s1 == s2);
    }

}
