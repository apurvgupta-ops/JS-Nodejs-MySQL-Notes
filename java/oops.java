
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
