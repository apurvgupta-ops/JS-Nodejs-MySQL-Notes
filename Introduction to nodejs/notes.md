
# **Windows Subsystem for Linux (WSL)**
- To access the WSL (Ubuntu) folder, type in the search box: `\\wsl$`
- To install WSL, open the terminal and type: `wsl --install`
- _This command installs the virtual Ubuntu system on Windows._
---

# **Pro Tip**

In an `.html` file, if you use the `<script>` tag before the `<body>` tag, the body content will load after the script finishes executing.  
If you want the script to load asynchronously, use the `defer` attribute in the `<script>` tag.

---

# **What is Node.js?**

Node.js is a C++ application (CLI) that can interpret and run JavaScript code outside the browser.  
It provides a runtime environment built on the Chrome V8 engine, enabling developers to execute JavaScript on the server side.

---

# **Basics of Terminal**

### **Using Git Bash**

- **Bash** is a scripting language. Bash scripts use the `.sh` file extension.
- **Common Commands**:
- `echo`: Print something to the terminal.
- `pwd`: Display the current directory.
- `whoami`: Show the current user.
- `source ~/.bashrc`: Reload the `bashrc` file.

---

### **Navigating Directories**

- `cd .` : Show the current directory.
- `cd ..` : Move to the parent directory.
- `cd ~/` : Move to the main parent folder.
- `cd ../filename`: Move backward and navigate to a specific file/folder.

---

### **File Operations**

- `ls`: List all files in the current directory.
- `ls -a`: Include hidden files.
- `ls -l`: Show file details with permissions.
- `touch filename`: Create a new file.
- `mkdir foldername`: Create a new folder.
- `cp source destination`: Copy a file to a specified location.
- `mv source destination`: Move or rename a file.
- `rm -rf filename`: Remove a file or folder.
- `cat filename`: View the content of a file.
- `nano filename`: Edit a file (use `Ctrl + O` to save, `Ctrl + X` to exit).
- `vim filename`: Edit a file (press `i` to edit, `:w` to save, `:q` to quit).
- `explorer .`: Open the current path in File Explorer.

---

# **File Permissions**

### **Using `chmod`**

`chmod` is used to change the permissions of a file or folder.

#### **Basic Commands:**
```sh
chmod +x index.js  # Give execute permission to the current user for this file/folder.
chmod -x index.js  # Remove execute permission from the current user for this file/folder.
```

### **Permission Symbols:**
| Symbol | Meaning |
|--------|---------|
| `d` | Directory (folder) |
| `r` / `4` | Read permission |
| `w` / `2` | Write permission |
| `x` / `1` | Execute permission |
| `-` | Indicates a file (not a directory) |

### **Understanding Permissions:**
A permission string consists of **10 characters**:

1. **First character:** Indicates whether it is a file (`-`) or a directory (`d`).
2. **Next three characters (`rwx`):** Represent **user (owner) permissions**.
3. **Next three characters (`rwx`):** Represent **group permissions**.
4. **Last three characters (`rwx`):** Represent **other users' (world) permissions**.

#### **Example: `-rwx--x--x`**
- `-` → Indicates it is a file.
- `rwx` → Owner has read (`r`), write (`w`), and execute (`x`) permissions.
- `--x` → Group has only execute (`x`) permission.
- `--x` → Others (world) have only execute (`x`) permission.

### **Numeric Permissions:**
We can also set permissions using **numbers**:
- `777` → Full permissions (read, write, execute for all users).
- `644` → Owner can read/write, others can only read.
- `755` → Owner can read/write/execute, others can read/execute.
- `652` → Owner can read/write, group can read/execute, others can write.

### **Examples:**
```sh
chmod u+r,g+r,o+r index.js  # Give read permission to all users.
chmod +r index.js  # Read permission to all.
chmod +w index.js  # Write permission only for the current user.
chmod u+w,g+w index.js  # Give write permission to user and group.
chmod 777 index.js  # Give all permissions to all users.
chmod 652 index.js  # Read & write for user, read & execute for group, write for others.
```


---

# **Basics of Operating Systems**

### **Context Switching**

- Allows multitasking on limited cores by allocating CPU time in rapid succession.

---

### **Processes and Threads**

- **Process**: A sequence of instructions executed in order.
- **Thread**: A lightweight unit of execution within a process.

---

### **Concurrency vs Parallelism**

- **Concurrency**: Multiple threads on a single core (context switching).
- **Parallelism**: Threads run simultaneously on multiple cores.

---

# **Node.js Overview**

### **CommonJS vs Module System**

1. CommonJS loads files synchronously, while the module system loads asynchronously.
2. Extensions (`.cjs`, `.mjs`) are mandatory in the module system.
3. CommonJS provides `__dirname` and `__filename` natively; modules use `import.meta`.
4. `this` keyword:

- Undefined in the module system.
- References `module.exports` in CommonJS.

5. Modules enable top-level `await` and strict mode by default.

---

### **Shebang**

- Add `#!` to the top of a file to define its execution environment.
- Example: #!node => before shebang the command for exexute some file is node app.js, now app.js only.

---

### **NPX**

- npx is a used to run the cli library like vite etc,
  - There are two types of library's, package library , cli library, main difference is we can import the package library the file and use them like bcrypt, axios etc, and cli library like vite etc.

---

### **NUMBER SYSTEM**

- In the computer world all the code is working on the binary system, because it is easy to understand, but for humans we are using decimal number system.
- We use 4 types of system :

  1. Binary => 0,1 => starts with 0b => 2^
  2. Octal => 0,1,2,3,4,5,6,7 => starts with 0o => 8^
  3. Decimal => 0,1,2,3,4,5,6,7,8,9 => This is normal as we write => 10^
  4. HexaDecimal => 0,1,2,3,4,5,6,7,8,9,A,B,C,D,F => starts with 0x => 16^

- The main conversion is binery, octa, HexaDecimal to decimal, because this is widely use.

  ```javascript
  binary => 1111
  conversion => 1 x 2^0 = 1
                1 x 2^1 = 2
                1 x 2^2 = 4
                1 x 2^3 = 8
                      = 15 ``
  ```

- Same process goes for all.
- But in the old time we are facing one problem , and the problem is how to save characters, thats why engineer introcuce charactercoding, and character set.
- Characters encoding is depends on character set(ASCII(128 character, works on 7 bits => approx 1byte for one charachter), UNICODE) (Please rewatch this section for better understanding)

---

### **BUFFER**

- Buffer uses ArrayBuffer function of js behind the scene.
- Pure JavaScript is great with Unicode-encoded strings, but it does not handle binary data very well. It is not problematic when we perform an operation on data at the browser level but at the time of dealing with TCP stream and performing a read-write operation on the file system is required to deal with pure binary data.

- To satisfy this need Node.js uses Buffer to handle the binary data. So in this article, we are going to know about buffer in Node.js.

**Buffer in Node**

- The Buffer class in Node.js is used to perform operations on raw binary data. Generally, Buffer refers to the particular memory location in memory. Buffer and array have some similarities, but the difference is array can be any type, and it can be resizable. Buffers only deal with binary data, and it can not be resizable. Each integer in a buffer represents a byte. console.log() function is used to print the Buffer instance.
- buffer has 2 main function alloc(), allocUnsafe() ;

1. alloc(4) => This function help to create the allocate the space in the memory and that memory is clear.
2. allocUnsafe(4) => This is same as alloc but when we want more space like(4000) bytes, then it comes with some data which is somewhere in that allocated space, and this is faster then alloc() , because this function does not check that the requried memory is totally empty or not.

**DRAWBACK**

- If we use buffers for the large data , then it create problems ;
- It filles the space in the memory , because behind the scene it uses ArrayBuffers and ArrayBuffers takes some space from the memory(ram).
- It slow down the server or somethings crash the server.

---

## **Streams**
### Types of Streams in Node.js
Node.js streams allow you to work with data efficiently by processing it incrementally, without loading the entire data into memory. Streams are particularly useful for handling large datasets or continuous data flows. There are four types of streams in Node.js:

#### 1. Readable Streams
Readable streams are used to **read data** from a source, such as reading files or receiving HTTP requests.

#### 2. Writable Streams
Writable streams are used to **write data** to a destination, such as writing to a file or sending HTTP responses.

#### 3. Duplex Streams
Duplex streams are streams that can **both read and write data**. These are useful for situations like network communication, where you both send and receive data.

#### 4. Transform Streams
Transform streams are a special type of duplex stream where the **output is a transformation of the input**. They modify or process the data as it passes through the stream, such as compressing or encrypting data.

- SEE [Streams Notes](./readable_stream_states.md)