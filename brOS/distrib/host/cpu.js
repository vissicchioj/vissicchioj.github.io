/* ------------
     CPU.ts
     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.
     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    //stepNum must begin at 0 because fetch is always the first instruction
    var stepNum = 0;
    //temporary program counter to remember our current place 
    var tempPC = 0x000;
    class Cpu {
        constructor(PC = 0x00, IR = 0x00, Acc = 0x00, Xreg = 0x00, Yreg = 0x00, Zflag = 0x00, isExecuting = false, pcb = null) {
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.pcb = pcb;
        }
        init() {
            this.PC = 0x00;
            this.IR = 0x00;
            this.Acc = 0x00;
            this.Xreg = 0x00;
            this.Yreg = 0x00;
            this.Zflag = 0x00;
            this.isExecuting = false;
        }
        currPcb(pcb) {
            this.pcb = pcb;
        }
        setPcb() {
            // Keep up PCB values with the PC values
            this.pcb.pc = this.PC;
            this.pcb.acc = this.Acc;
            this.pcb.xreg = this.Xreg;
            this.pcb.yreg = this.Yreg;
            this.pcb.zflag = this.Zflag;
        }
        loadCpuWithPcb() {
            // Will pickup the process where the CPU left off
            this.PC = this.pcb.pc;
            this.Acc = this.pcb.acc;
            this.Xreg = this.pcb.xreg;
            this.Yreg = this.pcb.yreg;
            this.Zflag = this.pcb.zflag;
        }
        // Cycles when isExecuting = true
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.IR = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.opCodes(this.IR);
            this.setPcb();
            TSOS.Control._SetCpuTable();
            TSOS.Control._SetMemTable();
            TSOS.Control._SetPcbTable();
            // Will stop executing after each cycle, but when Step is pressed again it will execute the next cycle
            TSOS.Control._Step = false;
            if (TSOS.Control._SingleStep === true) {
                if (TSOS.Control._Step === false) {
                    this.isExecuting = false;
                }
            }
            // Increment our counter because one cycle has been completed
            _CpuSched.cycleCounter = _CpuSched.cycleCounter + 1;
            _Kernel.calcTurnaroundTimeWaitTime();
            _Kernel.boolFinished = false;
        }
        opCodes(currInstruction) {
            switch (currInstruction) {
                case 0xA9:
                    this.LDAConstant();
                    break;
                case 0xAD:
                    this.LDAMemory();
                    break;
                case 0x8D:
                    this.STAMemory();
                    break;
                case 0x6D:
                    this.ADC();
                    break;
                case 0xA2:
                    this.LDXConstant();
                    break;
                case 0xAE:
                    this.LDXMemory();
                    break;
                case 0xA0:
                    this.LDYConstant();
                    break;
                case 0xAC:
                    this.LDYMemory();
                    break;
                case 0xEA:
                    this.NOP();
                    break;
                case 0x00:
                    this.BRK();
                    break;
                case 0xEC:
                    this.CPX();
                    break;
                case 0xD0:
                    this.BNE();
                    break;
                case 0xEE:
                    this.INC();
                    break;
                case 0xFF:
                    this.SYS();
                    break;
                default:
                    _CPU.isExecuting = false;
                    _StdOut.putText("Error: Invalid Op Code. Killing all processes...");
                    _OsShell.shellKillAll(null);
                    _StdOut.advanceLine();
            }
        }
        // Fetch, Decode, and Execute do not have to be separated which will remove some complexity that I struggled with in Org & Arch
        // Just need to remember to increment PC at the start of each Op Code (minus BRK) and everytime we access memory
        // Also this time the MA handles reading and writing, NOT the MM like in Org & Arch
        LDAConstant() {
            this.PC++;
            // Set Acc to the current location in memory 
            this.Acc = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            this.PC++;
        }
        LDAMemory() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            //Set accumulator to loaction in memory using little endian conversion
            this.Acc = _MA.read(this.pcb.baseReg, this.pcb.limitReg, _MM.combineBytes(_MM.lob, _MM.hob));
            this.setPcb();
            this.PC++;
        }
        STAMemory() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            //combine the bytes for little endian conversion
            _MA.write(this.pcb.baseReg, this.pcb.limitReg, _MM.combineBytes(_MM.lob, _MM.hob), this.Acc);
            this.setPcb();
            this.PC++;
        }
        ADC() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            //Set accumulator to loaction in memory using little endian conversion
            this.Acc = this.Acc + _MA.read(this.pcb.baseReg, this.pcb.limitReg, _MM.combineBytes(_MM.lob, _MM.hob));
            this.PC++;
        }
        LDXConstant() {
            this.PC++;
            this.Xreg = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            this.PC++;
        }
        LDXMemory() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            //Set Xreg to loaction in memory using little endian conversion
            this.Xreg = _MA.read(this.pcb.baseReg, this.pcb.limitReg, _MM.combineBytes(_MM.lob, _MM.hob));
            this.PC++;
        }
        LDYConstant() {
            this.PC++;
            this.Yreg = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            this.PC++;
        }
        LDYMemory() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            //Set Yreg to loaction in memory using little endian conversion
            this.Yreg = _MA.read(this.pcb.baseReg, this.pcb.limitReg, _MM.combineBytes(_MM.lob, _MM.hob));
            this.PC++;
        }
        NOP() {
            this.PC++;
        }
        CPX() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            //sets zFlag to 0 if the combination of the lob and hob does not equal the xReg
            if (_MA.read(this.pcb.baseReg, this.pcb.limitReg, _MM.combineBytes(_MM.lob, _MM.hob)) !== this.Xreg) {
                this.Zflag = 0x00;
            }
            //sets zFlag to 1 if the combination of the lob and hob does equal the xReg
            else {
                this.Zflag = 0x01;
            }
            this.PC++;
        }
        BNE() {
            this.PC++;
            this.setPcb();
            //if zFlag is not set
            if (this.Zflag == 0x00) {
                this.PC = this.PC + _MM.combineBytes(_MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC), 0x00);
                this.setPcb();
                //then remove the 1 in the front so that we are moving backwards
                //and not moving extremely far forwards
                if (this.PC > 0xFF) {
                    this.PC = this.PC - 0x100;
                    this.setPcb();
                }
                this.PC++;
            }
            //branch fails because the zFlag is 1
            else {
                this.PC++;
            }
        }
        INC() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC);
            this.setPcb();
            //Set accumulator to loaction in memory using little endian conversion
            this.Acc = _MA.read(this.pcb.baseReg, this.pcb.limitReg, _MM.combineBytes(_MM.lob, _MM.hob));
            this.setPcb();
            this.Acc++;
            // Set address in memory using little endian conversion to the accumulator
            _MA.write(this.pcb.baseReg, this.pcb.limitReg, _MM.combineBytes(_MM.lob, _MM.hob), this.Acc);
            this.PC++;
        }
        SYS() {
            //this.PC++;
            //System Call 1
            if (this.Xreg == 0x01) {
                //print out the value in the yReg
                _StdOut.putText(this.Yreg + "");
            }
            //System Call 2
            if (this.Xreg == 0x02) {
                var asciiStr = '';
                // tempPC will remember where the PC was before the Sys call
                tempPC = this.PC;
                this.PC = this.Yreg;
                this.setPcb();
                while (_MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC) !== 0x00) {
                    // Get all of the ascii characters in the current location in memory until it reaches 0x00
                    asciiStr = asciiStr + String.fromCharCode(_MA.read(this.pcb.baseReg, this.pcb.limitReg, this.PC));
                    ;
                    this.PC++;
                    this.setPcb();
                }
                // Print out the string
                _StdOut.putText(asciiStr);
                // Go back to where we were before the Sys call
                this.PC = tempPC;
            }
            this.PC++;
        }
        BRK() {
            // PROGRAM COMPLETE
            this.pcb.state = "Finished";
            // When our ready queue is empty, every program is complete
            if (_Kernel.readyQueue.getSize() === 0) {
                //console.log('Ready Queue Size:' + _Kernel.readyQueue.getSize());
                this.init();
                this.isExecuting = false;
                _StdOut.advanceLine();
                _Kernel.boolFinished = true;
            }
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map