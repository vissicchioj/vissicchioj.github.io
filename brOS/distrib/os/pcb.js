var TSOS;
(function (TSOS) {
    class ProcessControlBlock {
        constructor(pid = -1, state = '', location = '-', priority = 0, pc = 0, acc = 0, xreg = 0, yreg = 0, zflag = 0, baseReg = 0, limitReg = 0, turnaround = 0, wait = 0, calc = false, diskKey = "", userProg = []) {
            this.pid = pid;
            this.state = state;
            this.location = location;
            this.priority = priority;
            this.pc = pc;
            this.acc = acc;
            this.xreg = xreg;
            this.yreg = yreg;
            this.zflag = zflag;
            this.baseReg = baseReg;
            this.limitReg = limitReg;
            this.turnaround = turnaround;
            this.wait = wait;
            this.calc = calc;
            this.diskKey = diskKey;
            this.userProg = userProg;
        }
        init() {
            this.pid = -1;
            this.state = '';
            this.location = 'Memory';
            this.priority = 0;
            this.pc = 0;
            this.acc = 0;
            this.xreg = 0;
            this.yreg = 0;
            this.zflag = 0;
            this.baseReg = 0;
            this.limitReg = this.baseReg + 256;
            this.turnaround = 0;
            this.wait = 0;
            this.calc = false;
            this.diskKey = "";
            this.userProg;
        }
    }
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map