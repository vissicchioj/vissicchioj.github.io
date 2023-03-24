var TSOS;
(function (TSOS) {
    class CpuDispatcher {
        //Cpu Dispatcher is in charge of performing the context switch
        constructor() {
        }
        contextSwitch() {
            // Check that the ready queue still has processes left
            if (_Kernel.readyQueue.getSize() > 0) {
                // there was no last pcb (Meaning this is the first pcb to be ran in the CPU)
                if (_CPU.pcb !== null) {
                    // If the pcb is already finished don't add it back to the queue
                    if (_CPU.pcb.state !== "Finished") {
                        //put it back on the ready queue for the next context switch
                        var lastPCB = _CPU.pcb;
                        lastPCB.state = "Ready";
                        _Kernel.readyQueue.enqueue(lastPCB);
                    }
                }
                // Get the next pcb that will be context switched in and run it in the CPU
                var nextPCB = _Kernel.readyQueue.dequeue();
                nextPCB.state = "Running";
                if (nextPCB.location === "Disk") {
                    // nextPCB.location = "Memory";
                    // lastPCB.location = "Disk";
                    // nextPCB.baseReg = lastPCB.baseReg;
                    // nextPCB.limitReg = lastPCB.limitReg;
                    // var userProg = [];
                    // userProg = _MM.getMemory(lastPCB.baseReg);
                    // //userProg = _MA.userProgFromMem(lastPCB.baseReg);
                    // _krnDiskSystem.rollOut(lastPCB.pid, userProg);
                    // _krnDiskSystem.rollIn(nextPCB.pid, lastPCB.baseReg, lastPCB.limitReg);
                    // lastPCB.baseReg = 768;
                    // lastPCB.limitReg = 768;
                    // //TSOS.Control._SetPcbTable();
                    // //TSOS.Control._setDiskTable();
                    nextPCB.location = "Memory";
                    _CPU.pcb.location = "Disk";
                    nextPCB.baseReg = _CPU.pcb.baseReg;
                    nextPCB.limitReg = _CPU.pcb.limitReg;
                    var userProg = [];
                    userProg = _MM.getMemory(_CPU.pcb.baseReg);
                    //userProg = _MA.userProgFromMem(lastPCB.baseReg);
                    _Kernel.krnTrace("Rolling Out");
                    _krnDiskSystem.rollOut(_CPU.pcb.pid, userProg);
                    _Kernel.krnTrace("Rolling In");
                    _krnDiskSystem.rollIn(nextPCB.pid, _CPU.pcb.baseReg, _CPU.pcb.limitReg);
                    _CPU.pcb.baseReg = 768;
                    _CPU.pcb.limitReg = 768;
                    //TSOS.Control._SetPcbTable();
                    //TSOS.Control._setDiskTable();
                }
                _CPU.currPcb(nextPCB);
                // The PCB saves variables that the CPU needs in order to continue where it was last switched off from
                _CPU.loadCpuWithPcb();
                // Tell the CPU to begin executing
                if (TSOS.Control._SingleStep === true) {
                    // Waiting on Step button clicks
                }
                else {
                    _CPU.isExecuting = true;
                }
            }
        }
    }
    TSOS.CpuDispatcher = CpuDispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuDispatcher.js.map