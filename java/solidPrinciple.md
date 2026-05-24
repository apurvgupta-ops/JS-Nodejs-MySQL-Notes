Is a SOLID Principle Followed or Not? (How to Detect & Fix)
Here is a simple matrix to diagnose which exact SOLID principle is suffering and the precise action needed to fix it:

1. Single Responsibility Principle (SRP)

How to know it's broken: Ask yourself: "How many reasons do I have to open and modify this specific file?" If the answer is more than one, SRP is broken. For instance, if changing the database schema OR changing how text renders forces you to rewrite lines in the same DocumentEditor class, it violates SRP.

What we do to follow it: Delegate tasks. Strip out non-core behaviors and hand them off to targeted classes. The orchestrator class shouldn't perform the tasks; it should merely coordinate specialized objects that do.

2. Open-Closed Principle (OCP)

How to know it's broken: When a new requirement comes in (e.g., "Support adding Tables to the document"), do you have to go inside your existing, tested rendering loops and write new code blocks? If yes, your system is closed to extension and open to modification.

What we do to follow it: Use Polymorphic Inheritance. Define a strict base abstract class or interface (DocumentElement). Any new feature must be written in a brand-new, isolated class that extends the parent, leaving old code completely untouched.

3. Liskov Substitution Principle (LSP)
   How to know it's broken: If a child class extends a parent class but throws an unexpected exception or breaks the application because it cannot handle a inherited method, LSP is violated. For example, if a read-only WatermarkElement inherits from DocumentElement but breaks when the system calls an expected edit() method, the substitution fails.

What we do to follow it: Keep inheritance trees logically clean and unified. If a child class cannot fulfill the implicit functional promise of the parent's interface, do not use inheritance—use object composition instead.

4. Interface Segregation Principle (ISP)
   How to know it's broken: Look at your interfaces/abstract classes. If a concrete class implements an interface but leaves several methods empty or throwing UnsupportedOperationException, the interface is bloated. The class is being forced to depend on methods it does not use.

What we do to follow it: Break fat interfaces down into smaller, highly specific, cohesive contracts. Instead of a massive ICar interface with drive(), changeGear(), and chargeBattery(), separate them out so an ElectricCar doesn't have to carry empty gear-shifting boilerplate code.

5. Dependency Inversion Principle (DIP)
   How to know it's broken: Look at your imports or instantiation steps. If a high-level manager class directly initializes a concrete low-level utility class using the new keyword (e.g., this.storage = new FileStorage()), it is tightly coupled. If you ever want to switch to cloud database storage, you have to tear up your high-level class code.

What we do to follow it: Inject abstractions. Program to an interface, not an implementation. Your high-level class should accept an abstract contract parameter (like Persistence) via its constructor, completely unconcerned with whether the underlying runtime instance writes to a local disk or a remote cloud cluster.
