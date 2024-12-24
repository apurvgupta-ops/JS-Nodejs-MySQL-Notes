<!-- https://github.com/procodrr/javascript-course -->

1. **About JS** => Pervisouly Js was a interpeted language, but after the chrome v8 engine js become JIT (Just in time compiler).
   => **Interpeter** => It reads the code line by line and convert this into the binary code, But because of this the execution become slow.
   => **Compiler** => It reads the whole code and convert them into the binary code, and because of that the execution become fast.
   => Js follow BODMAS for calculation, but in case of +/- it follow first come first solve.
   ex : console.log(5 + 6 - 4 / 2 \* 2) = 7
   ex : console.log(5 - 6 + 2) = 1.

2. **Data Types**(Primitive) => Number, string, boolean, undefined, null, bigint, symbol.
   => To check the DataType of a something , we can use [typeof] property
   => example for changes string to number and vise versa :
   => +'100' = 100 => if there is string added after the number then it gives NaN (100sdasd)
   => parseInt('100') = 100 => if there is string added after the number then it gives NaN (100sdasd) , this only give number but if the value is not started with string, and contain some number, other it also give NaN
   => 100 + '' = '100'

=> Type of NaN is [Number], this is a bug in the JS.
=> Type of NULL is [Object], this is a bug in the JS.

3. **Var, let, const** => All Three are used for declaring the variables, but in different sinorieo.
   => const => const is a type of constant , if you dont want change the value of a variable then use const, this is block scope, means we can only use inside that block.
   => let => If you want to change the value according to the situations then use let, and this is also block scope.
   => var => Same as let, but this is function scope.

4. **Code Running process** => In Js code is running line by line, first js create the execution context and then first phase get started which is memory creation phase in this all the variables created with let, const, var values marked as undefined with there data type also, then after the memory execution second phase which is code execution phase, in this js started from top and read every line and then assign the value to the particular variables and data types accordingly.

5. **Dialog Boxes** => There are three type of dialog boxex.
   => alert => this is just for the alert, with no return value.
   => confirm => This is for ask the user he is ok or not , confirm give two buttons ok and cancel, and return value is boolean.
   => prompt => this is for user input , this provides input box, and two buttons , return value is the value put in the input box (on Ok button) and on cancel button it provides null value.

6. **String methods and properties** => Check string.html

7. **Math** => Check math.html

8. **Truthy and Falsy Values** => Falsy Values = 0, -0, "", undefined, null, NaN. Other then this all are truthy values.
   => Methods to check values are truthy or falsy =>
   => Boolean(10) => true.
   => !!10 => true
   => !!'' => false

9. **If/Else** => check ifelse.html
