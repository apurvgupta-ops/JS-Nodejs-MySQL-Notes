PRO TIP => In .html file if you use script tag before body then the body tag details load after the script tag finish, but if you want the script tag work as a async then we have to use defer property in script tag.

what is nodejs => Nodejs is the c++ applcation(CLI) which can understand and run javascript code outside the browser. It provides a run time enviroment built on chorme v8 engine, enabling developers to execute javascript on the server side.

---

// BASICS OF TERMINAL =>  
=> For the terminal we are using git bash (Bash is the scripting language) (if we want create the bash file then ,the extension is .sh)
=> echo comman d is used for print something in terminal.
=> pwd => gives the current directory.
=> whoami => give current user.
=> cd => change current directory.
=> ls/dir => give all the files in the current directory.
=> touch => make the file.
=> touch index.html
=> mkdir => make the folder(DIRECTORY).
=> mkdir src
=> cp => copy the file from one place to another(note => set the path then both the argument get append).
=> cp filename place where to copy
=> cp index.html src
=> mv => move the file from one play to another, and used for rename also (note => set the path then both the argument get append).
=> mv filename place where to copy
=> mv filename newfilename
=> mv index.html src
=>rm -rf => to remove any file, folder, empty folder (we can use rm for only file, rmdir for empty folder, rm -r for remove folder with some data init (-r means recusively)).
=> rm -rf filename

=> cat => to open a file and read the content.
=> cat index.html
=> nano => to edit the file (ctrl + o to save, ctrl + x to exit).
=> nano index.html
=> vim => to edit the file (press i to start editing , esc to stop editing, :w to save , :q to exit , and :wq to save and exit ).
=> vim index.html

---

// BASICS OF OS => software to eximine process and thread use (system informer).
=> context switching => Suppose i have a computer of 4 cores , it means my computer can handle 4 application/process, means 1 core can handle 1 application until we close them. but this is the issue that why OS comes into the picture , because in todays world we can see 4 core computer can run 10 20 etc application at a time, this is due to OS. OS send the application to the core in every 1ms and again back to the same place (to and fro motion) this process is called context switching.

=> process => A process is defined as a sequence of instructions executed in a predefined order. In simple words, any program that is executed is termed as a process. Processes change their state as they execute and can be either new, ready, running, waiting or terminated.

=> thread => Thread is the worker of process. Means process create the thread to get the work done fast.
=> If we create the multiple threads and have only one core the phenomena called concurrency. because one thread go and comes then second one go (context switching).
=> If we have multiple thread and multiple core then the phenomena called paraellism.

      => * If we have 9 threads and only have 6 core then we called that 9 core is concurrent and 6 core is in parallism.

      => ** So because of multiple threads then nodejs called multithread language.Threads is faster then the single thread(main thread) .beacuse it takes the extra cpu space and use remaining core in the system.