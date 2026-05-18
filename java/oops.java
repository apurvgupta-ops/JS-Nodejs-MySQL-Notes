
public class oops {

    public static void main(String[] args) {
        Student student0 = new Student();
        Student student = new Student("John");
        Student student1 = new Student("Alice", 20);

        Student student2 = new Student("Bob", 22);
        Student student3 = new Student("Charlie", 25, "123 Main St");

        student0.display();
        student.display();
        student1.display();
        student2.display();
        student3.display();

        CallByValueAndReference.main(args);
        DeepAndShallowCopy.main(args);
        StaticAndFinal.main(args);

    }

}

class Student {

    String name;
    int age;

    // Default constructor
    Student() {
        this.name = "";
        this.age = 0;
    }

    // Parameterized constructor
    // constructor overloading
    Student(String name) {
        this.name = name;
        this.age = 0;
    }

    Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // copy constructor
    Student(Student s) {
        this.name = s.name;
        this.age = s.age;
    }

    // method to display student details
    void display() {
        System.out.println("Name: " + name + ", Age: " + age);

    }

    // method to update student details
    void updateDetails(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Constructor chaining
    Student(String name, int age, String address) {
        this(name, age); // calling the parameterized constructor
        // this.address = address; // assuming there's an address field
    }

}

// call by value and call by reference
class CallByValueAndReference {

    public static void main(String[] args) {
        int a = 10;
        System.out.println("Before call by value: " + a);
        callByValue(a);
        System.out.println("After call by value: " + a);

        Student student = new Student("John", 20);
        System.out.println("Before call by reference: " + student.name + ", " + student.age);
        callByReference(student);
        System.out.println("After call by reference: " + student.name + ", " + student.age);
    }

    static void callByValue(int x) {
        x = 20; // This will not change the original value of 'a'
    }

    static void callByReference(Student s) {
        s.name = "Alice"; // This will change the name of the original student object
        s.age = 25; // This will change the age of the original student object  

    }
}

// Deep Copy and Shallow Copy
class DeepAndShallowCopy {

    public static void main(String[] args) {
        Student student1 = new Student("John", 20);
        Student student2 = new Student(student1); // Deep copy using copy constructor

        System.out.println("Before modification:");
        System.out.println("Student 1: " + student1.name + ", " + student1.age);
        System.out.println("Student 2: " + student2.name + ", " + student2.age);

        student2.name = "Alice"; // Modifying student2's name
        student2.age = 25; // Modifying student2's age

        System.out.println("After modification:");
        System.out.println("Student 1: " + student1.name + ", " + student1.age); // Unchanged
        System.out.println("Student 2: " + student2.name + ", " + student2.age); // Changed
    }
}

// Static and final keywords
class StaticAndFinal {

    static int staticVariable = 10; // Static variable
    final int finalVariable = 20; // Final variable

    public static void main(String[] args) {
        System.out.println("Static Variable: " + staticVariable);
        // System.out.println("Final Variable: " + finalVariable); // This will cause an error

        StaticAndFinal obj1 = new StaticAndFinal();
        StaticAndFinal obj2 = new StaticAndFinal();

        System.out.println("Static Variable from obj1: " + obj1.staticVariable);
        System.out.println("Static Variable from obj2: " + obj2.staticVariable);

        obj1.staticVariable = 30; // Modifying static variable through obj1

        System.out.println("After modification:");
        System.out.println("Static Variable from obj1: " + obj1.staticVariable); // Changed
        System.out.println("Static Variable from obj2: " + obj2.staticVariable); // Changed
    }
}

// Encapsulation, Inheritance, Polymorphism, Abstraction can be added in the future.

