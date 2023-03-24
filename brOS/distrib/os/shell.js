/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        constructor() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereami, "whereami", "- Displays your current location.");
            this.commandList[this.commandList.length] = sc;
            // stairs
            sc = new TSOS.ShellCommand(this.shellStairs, "stairs", "<character> - Creates stairs of <character>.");
            this.commandList[this.commandList.length] = sc;
            // status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Displays status as <string>.");
            this.commandList[this.commandList.length] = sc;
            // BSOD
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", " - Blue screen of death test.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", " - Loads the User Program Input.");
            this.commandList[this.commandList.length] = sc;
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", " - Runs a program in memory.");
            this.commandList[this.commandList.length] = sc;
            // clearmem
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", " - Clear all memory partitions.");
            this.commandList[this.commandList.length] = sc;
            // runall
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", " - Runs all programs at once.");
            this.commandList[this.commandList.length] = sc;
            // ps
            sc = new TSOS.ShellCommand(this.shellPs, "ps", " - Display PID and state of all processes.");
            this.commandList[this.commandList.length] = sc;
            // kill
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<pid> - Kill one process based on specfied PID.");
            this.commandList[this.commandList.length] = sc;
            // killall
            sc = new TSOS.ShellCommand(this.shellKillAll, "killall", " - Kill all processes.");
            this.commandList[this.commandList.length] = sc;
            // quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<int> - Sets the Round Robin quantum.");
            this.commandList[this.commandList.length] = sc;
            //format
            sc = new TSOS.ShellCommand(this.shellFormat, "format", " - Initialize all blocks in all sectors in all tracks");
            this.commandList[this.commandList.length] = sc;
            //create
            sc = new TSOS.ShellCommand(this.shellCreate, "create", "<fileName> - Create the file <fileName>");
            this.commandList[this.commandList.length] = sc;
            //read
            sc = new TSOS.ShellCommand(this.shellRead, "read", "<fileName> - Read and display contents of <fileName>.");
            this.commandList[this.commandList.length] = sc;
            //write
            sc = new TSOS.ShellCommand(this.shellWrite, "write", "<fileName> \"data\" - Write the data inside the quotes (excluding the quotes themselves) to <fileName>");
            this.commandList[this.commandList.length] = sc;
            //delete
            sc = new TSOS.ShellCommand(this.shellDelete, "delete", "<fileName> - Remove <fileName> from storage.");
            this.commandList[this.commandList.length] = sc;
            //copy
            sc = new TSOS.ShellCommand(this.shellCopy, "copy", "<existing fileName> <new fileName> - Copies file.");
            this.commandList[this.commandList.length] = sc;
            //rename
            sc = new TSOS.ShellCommand(this.shellRename, "rename", "<curr fileName> <new fileName> - Renames file.");
            this.commandList[this.commandList.length] = sc;
            //ls
            sc = new TSOS.ShellCommand(this.shellLs, "ls", " - Lists the files currently stored on disk.");
            this.commandList[this.commandList.length] = sc;
            //getSchedule
            sc = new TSOS.ShellCommand(this.shellGetSchedule, "getsched", " - Displays current scheduling method.");
            this.commandList[this.commandList.length] = sc;
            //setSchedule
            sc = new TSOS.ShellCommand(this.shellSetSchedule, "setsched", "<[RR, FCFS]> - Sets the scheduling method.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            // buffer = buffer.toLowerCase();
            // 2. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 3. Lower case the shell command
            // moved it to 3 so that the args can stay case sensitive
            tempList[0] = tempList[0].toLowerCase();
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        //APP_NAME and APP_VERSION can be found in globals.ts
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0].toLowerCase();
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands. This is best when you forget the name of each command.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    case "ver":
                        _StdOut.putText("Ver displays the current version data.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shutdown will shutdown (go figure) the virtual OS. Note that it leaves the underlying host / hardware simulation running.");
                        break;
                    case "cls":
                        _StdOut.putText("Cls will clear the screen for you and reset the cursor position. Best used when you want a clean slate.");
                        break;
                    case "man":
                        _StdOut.putText("Uhh... did you just use the manual to find out what the manual is.");
                        break;
                    case "trace":
                        _StdOut.putText("Trace allows you to turn the OS trace on or off. Trace will provide an ongoing record information of the program's execution.");
                        break;
                    case "rot13":
                        _StdOut.putText("Rot13 does rot13 obfuscation on a given string. Rot13 is short for rotate 13 spaces which can be explained as a cipher that replaces a letter with the letter that appears 13 letters later in the alphabet. For example, the string abc will become nop.");
                        break;
                    case "prompt":
                        _StdOut.putText("Prompt will set the prompt. A prompt is where you type commands.");
                        break;
                    case "date":
                        _StdOut.putText("NOT THE FRUIT! Date displays the current date and time.");
                        break;
                    case "whereami":
                        _StdOut.putText("I know where you are. Try asking me.");
                        break;
                    case "stairs":
                        _StdOut.putText("Stairs will output 4 stairs of the character you input.");
                        break;
                    case "status":
                        _StdOut.putText("Status allows you to update the status displayed by the Host Log.");
                        break;
                    case "bsod":
                        _StdOut.putText("BSOD tests Blue Screen of Death.");
                        break;
                    case "load":
                        _StdOut.putText("Loads user input program into memory.");
                    case "run":
                        _StdOut.putText("Executes the program in memory.");
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0].toLowerCase();
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellDate(args) {
            const currDateTime = new Date();
            _StdOut.putText("" + currDateTime);
        }
        shellWhereami(args) {
            _StdOut.putText("Since you're a comp sci major... definitely not outside.");
        }
        shellStairs(args) {
            if (args.length > 0) {
                var character = args[0].charAt(0);
                for (let i = 0; i < 5; i++) {
                    //this will print the steps on the current level
                    for (let j = 0; j <= i; j++) {
                        _StdOut.putText("" + character);
                    }
                    //this will skip a line for the next level of steps
                    _StdOut.advanceLine();
                }
            }
            else {
                _StdOut.putText("Usage: stairs <character>  Please supply a character.");
            }
        }
        shellStatus(args) {
            if (args.length > 0) {
                document.getElementById('status').innerHTML = args.join(' ');
            }
            else {
                // if someone types nothing for their status it just means they love OS so much that they're at 
                // a loss for words. Don't worry brOS can put that in for you.
                document.getElementById('status').innerHTML = "I love OS";
            }
        }
        shellBSOD(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
            //color wont change idk why // FIXED, my hexidecimal color just wasn't working, maybe I mistyped
            _Canvas.style.backgroundColor = "lightblue";
            _StdOut.putText("A fatal error has occured!");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            //clearInterval(_hardwareClockID);
        }
        shellLoad(args) {
            // allows us to check if a string has hex digits using ranges
            // valid hex is from 0-F, this regular expression gets all of 0-9 and a-f (ignoring case)
            let regExpr = new RegExp(/^[0-9a-fA-F]+$/);
            // store the user input into a string, then remove all white space
            var userInput = document.getElementById('taProgramInput');
            // /\s/g = gets all whitespace within a string
            let regExprWhite = new RegExp(/\s/g);
            // we then replace all of that white space with nothing to essentially remove that white space
            var inputText = userInput.value.replace(regExprWhite, '');
            // then test the text using our regular expression. Returns true if it is valid hex digits
            // RegularExpression.test returns a boolean value if the pattern exists in a searched string.
            if (regExpr.test(inputText) === true) {
                //_StdOut.putText("Valid.");
                var hexNums = [];
                // Creates an array of strings of Length = 2 based on the entire string in User Program Input
                for (var i = 0; i < inputText.length; i += 2) {
                    hexNums.push(inputText.substring(i, i + 2));
                }
                var isAdded = _Kernel.load(hexNums);
                if (isAdded === true) {
                    _StdOut.putText('Process ID: ' + _Kernel.pidTracker);
                }
                else {
                    _StdOut.putText("Not enough space in memory");
                }
                //_StdOut.putText('base reg:' + _Kernel.residentList[_Kernel.pidTracker].baseReg);
                // Set the memory table with the new values.
                TSOS.Control._SetMemTable();
            }
            else {
                _StdOut.putText("Error: Only hex digits and spaces are valid.");
            }
        }
        shellRun(args) {
            // Check if a pid was provided
            if (args.length > 0) {
                if (_Kernel.pidTracker >= 0) {
                    // Pid exists, so run it
                    _Kernel.run(parseInt(args[0]));
                }
                else {
                    _StdOut.putText("Error: PID does not exist. Try loading a user program first.");
                }
            }
            else {
                _StdOut.putText("Error: You must provide a PID.");
            }
        }
        shellRunAll(args) {
            if (_Kernel.pidTracker >= 0) {
                _Kernel.runAll();
            }
            else {
            }
        }
        shellClearMem(args) {
            if (_CPU.isExecuting === true) {
                _StdOut.putText("Error: Cannot clear memory while CPU is executing.");
            }
            else {
                _Memory.reset();
                TSOS.Control._SetMemTable();
            }
        }
        shellPs(args) {
            for (var i = 0; i < _Kernel.residentList.length; i++) {
                _StdOut.putText("PID: " + _Kernel.residentList[i].pid + " State: " + _Kernel.residentList[i].state);
                _StdOut.advanceLine();
            }
        }
        shellKill(args) {
            if (args.length > 0) {
                // if (_CPU.isExecuting === true)
                // {
                //     _StdOut.putText("Error: Cannot kill processes while CPU is executing.");
                // }
                // else
                // {
                //check if it exists first prob
                _MM.setAvailableMemSeg(parseInt(args[0]));
                _Kernel.residentList[parseInt(args[0])].state = "Finished";
                //_Memory.reset();
                //TSOS.Control._SetMemTable();
                TSOS.Control._SetPcbTable();
                // }
            }
        }
        shellKillAll(args) {
            // if (_CPU.isExecuting === true)
            //     {
            //         _StdOut.putText("Error: Cannot kill processes while CPU is executing.");
            //     }
            // else
            // {
            _CPU.isExecuting = false;
            _CPU.PC = 0;
            _MM.setAllAvailableMemSeg();
            for (var i = 0; i < _Kernel.residentList.length; i++) {
                _Kernel.residentList[i].state = "Finished";
                //_Memory.reset();
                //TSOS.Control._SetMemTable();
                TSOS.Control._SetPcbTable();
            }
            //}
        }
        shellQuantum(args) {
            if (args.length > 0) {
                if (parseInt(args[0]) > 0) {
                    _CpuSched.quantum = parseInt(args[0]);
                    _CpuSched.prevQuantum = _CpuSched.quantum;
                    TSOS.Control._SetPcbTable();
                }
                else {
                    _StdOut.putText("Error: Quantum must be an integer larger than 0.");
                }
            }
        }
        shellFormat(args) {
            _krnDiskSystem.format();
        }
        shellCreate(args) {
            if (args.length > 0) {
                if (args[0].charAt(0) !== "~") {
                    if (args[0].length < 120) {
                        _krnDiskSystem.create(args[0], true);
                    }
                    else {
                        _StdOut.putText("Error: fileName too long.");
                    }
                }
                else {
                    _StdOut.putText("Error: fileNames cannot start with ~");
                }
            }
            else {
                _StdOut.putText("Error: Please supply a fileName.");
            }
        }
        shellRead(args) {
            if (args.length > 0) {
                _krnDiskSystem.read(args[0]);
            }
            else {
                _StdOut.putText("Error: Please supply a fileName.");
            }
        }
        shellWrite(args) {
            if (args.length > 0) {
                // check for data in quotes
                if (args[1].charAt(0) === '"') {
                    var dataStr = "";
                    var quoteCount = 0;
                    var i = 1;
                    //var currArg = args[2];
                    while (i < args.length) {
                        for (var j = 0; j < args[i].length; j++) {
                            if (args[i].charAt(j) !== '"') {
                                dataStr = dataStr + args[i].charAt(j);
                            }
                            else {
                                quoteCount++;
                                if (quoteCount === 2) {
                                    i = args.length;
                                    break;
                                }
                            }
                        }
                        i++;
                    }
                    //var dataStr = args[1].replace(/"/g, '');
                    if (quoteCount === 2) {
                        _krnDiskSystem.write(args[0], dataStr);
                    }
                    else {
                        _StdOut.putText("Error: Please supply a data string surrounded in quotation marks.");
                    }
                }
                else {
                    _StdOut.putText("Error: Please supply a data string surrounded in quotation marks.");
                }
            }
            else {
                _StdOut.putText("Error: Please supply a fileName.");
            }
        }
        shellDelete(args) {
            if (args.length > 0) {
                _krnDiskSystem.delete(args[0]);
            }
            else {
                _StdOut.putText("Error: Please supply a fileName.");
            }
        }
        shellCopy(args) {
            if (args.length > 0) {
                if (args[1].length < 120) {
                    if (args[0].length > 0 && args[1].length > 0) {
                        _krnDiskSystem.copy(args[0], args[1]);
                    }
                    else {
                        _StdOut.putText("Error: Please supply a new fileName.");
                    }
                }
                else {
                }
            }
            else {
                _StdOut.putText("Error: Please supply an existing fileName.");
            }
        }
        shellRename(args) {
            if (args.length > 0) {
                if (args[1].length < 120) {
                    if (args[0].length > 0 && args[1].length > 0) {
                        _krnDiskSystem.rename(args[0], args[1]);
                    }
                    else {
                        _StdOut.putText("Error: Please supply a new fileName.");
                    }
                }
                else {
                }
            }
            else {
                _StdOut.putText("Error: Please supply an existing fileName.");
            }
        }
        shellLs(args) {
            _krnDiskSystem.ls();
        }
        shellGetSchedule(args) {
            _StdOut.putText(_CpuSched.sched);
        }
        shellSetSchedule(args) {
            if (args.length > 0) {
                _CpuSched.setSchedule(args[0]);
            }
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map