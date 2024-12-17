1. **About JS** => Pervisouly Js was a interpeted language, but after the chrome v8 engine js become JIT (Just in time compiler).
=> **Interpeter** => It reads the code line by line and convert this into the binary code, But because of this the execution become slow.
=> **Compiler** => It reads the whole code and convert them into the binary code, and because of that the execution become fast.
=> Js follow BODMAS for calculation, but in case of +/- it follow first come first solve.
ex : console.log(5 + 6 - 4 / 2 * 2) = 7
ex : console.log(5 - 6 + 2) = 1.

2. **Data Types**(Primitive) => Number, string, boolean, undefined, null, bigint, symbol.
=> To check the DataType of a something , we can use [typeof] property
== example for changes string to number and vise versa :
 1. +'100' = 100 => if there is string added after the number then it gives NaN (100sdasd)
 2. parseInt('100') = 100 => if there is string added after the number then it gives NaN (100sdasd) , this only give number but if the value is not started with string, and contain some number, other it also give NaN
 3. 100 + '' = '100'

=> Type of NaN is [Object], this is a bug in the JS.

3. **Var, let, const** => 