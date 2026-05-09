
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

        // Bitwise operations
        int r = 5; // 0101 in binary
        int s = 3; // 0011 in binary
        int andResult = r & s; // Bitwise AND
        int orResult = r | s;  // Bitwise OR
        int xorResult = r ^ s; // Bitwise XOR
        System.out.println("Bitwise AND: " + andResult);
        System.out.println("Bitwise OR: " + orResult);
        System.out.println("Bitwise XOR: " + xorResult);

        // Logical operations
        boolean t = true;
        boolean u = false;
        boolean andLogical = t && u; // Logical AND
        boolean orLogical = t || u;  // Logical OR
        boolean notLogical = !t;     // Logical NOT
        System.out.println("Logical AND: " + andLogical);
        System.out.println("Logical OR: " + orLogical);
        System.out.println("Logical NOT: " + notLogical);

        // Ternary operator
        int v = 10;
        String ternaryResult = (v > 5) ? "Greater than 5" : "Less than or equal to 5";
        System.out.println("Ternary operator result: " + ternaryResult);

        // String concatenation
        String str1 = "Hello";
        String str2 = "World";
        String concatenated = str1 + " " + str2; // Using + operator
        System.out.println("String concatenation: " + concatenated);

        // String methods
        String str3 = "Java Programming";
        int length = str3.length(); // Length of the string
        String upperCase = str3.toUpperCase(); // Convert to uppercase
        String lowerCase = str3.toLowerCase(); // Convert to lowercase
        String substring = str3.substring(5, 16); // Extract substring
        System.out.println("String length: " + length);
        System.out.println("Uppercase: " + upperCase);
        System.out.println("Lowercase: " + lowerCase);
        System.out.println("Substring: " + substring);

        // String comparison
        String str4 = "Hello";
        String str5 = "Hello";
        String str6 = new String("Hello");
        System.out.println("String comparison using == : " + (str4 == str5));
        System.out.println("String comparison using == : " + (str4 == str6));
        System.out.println("String comparison using equals() : " + str4.equals(str6));

        // if-else statement
        int w = 15;
        if (w > 10) {
            System.out.println("w is greater than 10");
        } else {
            System.out.println("w is less than or equal to 10");
        }

        //  ladder if-else statement
        int x1 = 85;
        if (x1 >= 90) {
            System.out.println("Grade: A");
        } else if (x1 >= 80) {
            System.out.println("Grade: B");
        } else if (x1 >= 70) {
            System.out.println("Grade: C");
        } else if (x1 >= 60) {
            System.out.println("Grade: D");
        } else {
            System.out.println("Grade: F");
        }

        //  switch statement
        int day = 3;
        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;
            case 4:
                System.out.println("Thursday");
                break;
            case 5:
                System.out.println("Friday");
                break;
            case 6:
                System.out.println("Saturday");
                break;
            case 7:
                System.out.println("Sunday");
                break;
            default:
                System.out.println("Invalid day");
        }

        // why switch statement is better than if-else ladder
        // 1. Readability: Switch statements can be more readable than if-else ladders when dealing with multiple conditions based on the same variable.
        // 2. Performance: In some cases, switch statements can be more efficient than if else ladders, especially when there are many cases to evaluate.
        // 3. Maintainability: Switch statements can be easier to maintain and modify, as adding new cases is straightforward without affecting existing logic.
        // jump table in switch statement
        // A jump table is a data structure used in switch statements to optimize the execution of multiple cases. It allows the program to jump directly to the relevant case based on the value of the switch expression, rather than evaluating each case sequentially. This can improve performance, especially when there are many cases to evaluate.
    }
}
