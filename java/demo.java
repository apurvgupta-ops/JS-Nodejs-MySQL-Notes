
public class demo {

    public static void main(String[] args) {
        System.out.println("hello");

        // Integers
        int a = 10;
        byte b = 20;
        short c = 30;
        long d = 40L;

        // Floating-point numbers
        float e = 3.14f;
        double f = 3.14159;

        // Characters       
        char g = 65; // ASCII value for 'A'
        char h = 'B';

        // Booleans
        boolean i = true;
        boolean j = false;

        // Strings
        String k = "Hello, World!";

        // Output the values
        System.out.println("Integer a: " + a);
        System.out.println("Byte b: " + b);
        System.out.println("Short c: " + c);
        System.out.println("Long d: " + d);
        System.out.println("Float e: " + e);
        System.out.println("Double f: " + f);
        System.out.println("Character g: " + g);
        System.out.println("Character h: " + h);
        System.out.println("Boolean i: " + i);
        System.out.println("Boolean j: " + j);
        System.out.println("String k: " + k);

        // Implicit type conversion (widening)
        int x = 100;
        long y = x; // int to long (widening)
        System.out.println("Implicit type conversion (widening): " + y);

        // Explicit type conversion (narrowing)
        double m = 3.14;
        int n = (int) m; // double to int (narrowing)
        System.out.println("Explicit type conversion (narrowing): " + n);

        // Truncation in narrowing conversion
        double o = 3.99;
        int p1 = (int) o; // double to int (truncation)
        System.out.println("Truncation in narrowing conversion: " + p1);

        // Type promotion in expressions
        int p = 5;
        double q = 2.5;
        double result = p + q; // int promoted to double
        System.out.println("Type promotion in expressions: " + result);
    }

}
