/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Kernel {
        constructor() {
            // Resident list will take in loaded processes 
            this.residentList = [];
            // Ready queue will take in running processes
            this.readyQueue = new TSOS.Queue();
            this.pidTracker = -1;
            this.boolFinished = false;
        }
        //
        // OS Startup and Shutdown Routines
        //
        krnBootstrap() {
            TSOS.Control.hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.
            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.
            // Initialize the console.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.
            _Console.init();
            // Inititalize the Memory Manager
            _MM = new TSOS.MemoryManager();
            _CpuSched = new TSOS.CpuScheduler();
            _CpuDispatch = new TSOS.CpuDispatcher();
            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;
            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard(); // Construct it.
            _krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);
            // Load the Disk System Device Driver
            this.krnTrace("Loading the dsDD.");
            _krnDiskSystem = new TSOS.DeviceDriverDiskSystem();
            //
            // ... more?
            //
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();
            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }
        krnShutdown() {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        }
        krnOnCPUClockPulse() {
            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.
            */
            //_CpuSched.roundRobin();            
            _CpuSched.schedules();
            //this.calcTurnaroundTimeWaitTime();
            // Check for an interrupt, if there are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO (maybe): Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            }
            else if (_CPU.isExecuting) { // If there are no interrupts then run one CPU cycle if there is anything being processed.
                _CPU.cycle();
            }
            else { // If there are no interrupts and there is nothing being executed then just be idle.
                this.krnTrace("Idle");
            }
        }
        //
        // Interrupt Handling
        //
        krnEnableInterrupts() {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }
        krnDisableInterrupts() {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }
        krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);
            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR(); // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case CONTEXTSWITCH_IRQ:
                    _CpuDispatch.contextSwitch();
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        }
        krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
            // Or do it elsewhere in the Kernel. We don't really need this.
        }
        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile
        //
        // OS Utility Routines
        //
        krnTrace(msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would quickly lag the browser quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    }
                }
                else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        }
        krnTrapError(msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);
            // TODO: Display error on console, perhaps in some sort of colored screen. (Maybe blue?)
            this.krnShutdown();
        }
        // Loading a program into memory
        load(userProgram) {
            var canAdd = false;
            // Create a new PCB and add it to the resident list
            var newPCB = new TSOS.ProcessControlBlock();
            var base = _MM.getAvailableMemSeg();
            if (base === 768) {
                this.pidTracker++;
                newPCB.pid = this.pidTracker;
                newPCB.baseReg = base;
                newPCB.limitReg = newPCB.baseReg;
                newPCB.location = "Disk";
                newPCB.userProg = userProgram;
                newPCB.diskKey = _krnDiskSystem.create("~" + newPCB.pid);
                _krnDiskSystem.write6502("~" + newPCB.pid, userProgram.join(''));
                canAdd = true;
            }
            else if (base === -1) {
            }
            else {
                this.pidTracker++;
                newPCB.pid = this.pidTracker;
                newPCB.baseReg = base;
                newPCB.limitReg = newPCB.baseReg + 256;
                newPCB.location = "Memory";
                newPCB.userProg = userProgram;
                // Memory Manager allocates the User Program into memory
                _MM.allocateMem(newPCB.baseReg, userProgram);
                canAdd = true;
            }
            // Modulo Math to figure out which pcb gets what base register
            // if (newPCB.pid % 4 === 1)
            // {
            //     newPCB.baseReg = 256;
            //     newPCB.limitReg = newPCB.baseReg + 256;
            // }
            // else if (newPCB.pid % 4 === 2)
            // {
            //     newPCB.baseReg = 512;
            //     newPCB.limitReg = newPCB.baseReg + 256;
            // }
            // else if (newPCB.pid % 4 === 3)
            // {
            //     newPCB.baseReg = 769;
            //     newPCB.limitReg = newPCB.baseReg
            // }
            // else
            // {
            //     newPCB.limitReg = newPCB.baseReg + 256;
            // }
            // newPCB.limitReg = newPCB.baseReg + 256;
            // if (newPCB.baseReg !== 769)
            // {
            //     // Memory Manager allocates the User Program into memory
            //     _MM.allocateMem(newPCB.baseReg, userProgram);
            // }
            // else
            // {
            // }
            if (canAdd === true) {
                // change state
                newPCB.state = "Resident";
                // OUTDATED: modulo 3 makes it so that only 3 pcbs are being loaded at a time
                this.residentList[newPCB.pid] = newPCB;
            }
            // Update the PCB table with values
            TSOS.Control._SetPcbTable();
            return canAdd;
            //_StdOut.putText(this.residentList.length + ' ');
            // for (var i = 0; _Kernel.countTurnarounds.length; i++)
            //     {
            //         _Kernel.countTurnarounds[i] = false;
            //     }
        }
        // Running a program in memory
        run(pid) {
            // Run one program specified by the pid
            var pcb = this.residentList[pid];
            if (pcb.state === "Resident") {
                // change state
                pcb.state = "Running";
                // Update the PCB table with values
                TSOS.Control._SetPcbTable();
                this.readyQueue.enqueue(pcb);
                _CPU.currPcb(this.readyQueue.dequeue());
                // Tell the CPU to begin executing
                if (TSOS.Control._SingleStep === true) {
                    // Waiting on Step button clicks
                }
                else {
                    _CPU.isExecuting = true;
                }
            }
        }
        runAll() {
            _StdOut.putText("Running all...");
            for (var i = 0; i < this.residentList.length; i++) {
                var pcb = this.residentList[i];
                if (pcb.state === "Resident") {
                    pcb.state = "Ready";
                    this.readyQueue.enqueue(pcb);
                    // Checking the ready queue
                    //_StdOut.putText('Ready Queue Size:' + _Kernel.readyQueue.getSize());
                }
                // Will get dequeued via context switch
            }
        }
        calcTurnaroundTimeWaitTime() {
            //_StdOut.putText("Calcing");
            for (var i = 0; i < this.residentList.length; i++) {
                if (this.residentList[i] !== null) {
                    if (_CPU.isExecuting) {
                        if (this.residentList[i].state !== "Finished") {
                            this.residentList[i].turnaround++;
                        }
                    }
                    if (this.residentList[i].state === "Ready") {
                        this.residentList[i].wait++;
                    }
                    if (this.residentList[i].state === "Finished" && this.boolFinished === true && this.residentList[i].calc === false) {
                        _StdOut.advanceLine();
                        _StdOut.putText("Turnaround Time: " + this.residentList[i].turnaround);
                        _StdOut.advanceLine();
                        _StdOut.putText("Wait Time: " + this.residentList[i].wait);
                        _StdOut.advanceLine();
                        this.residentList[i].calc = true;
                    }
                }
            }
        }
    }
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=kernel.js.map