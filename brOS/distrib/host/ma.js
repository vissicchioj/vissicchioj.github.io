var TSOS;
(function (TSOS) {
    // Read and Writes Memory
    class MemoryAccessor {
        constructor() {
        }
        /*
            IP3:
                read and write will also need to take in base and limit registers as well. The address that we need will
                be located via adding addr to the base register
            
        */
        read(baseReg, limitReg, addr) {
            if (addr + baseReg >= limitReg) {
                _CPU.isExecuting = false;
                _StdOut.putText("Error: Memory out of bounds! Killing all processes...");
                _OsShell.shellKillAll(null);
                _StdOut.advanceLine();
            }
            else {
                return _Memory.getMem(addr + baseReg);
            }
        }
        write(baseReg, limitReg, addr, hex) {
            if (addr + baseReg >= limitReg) {
                _CPU.isExecuting = false;
                _StdOut.putText("Error: Memory out of bounds! Killing all programs...");
                _OsShell.shellKillAll(null);
                _StdOut.advanceLine();
            }
            else {
                _Memory.setMem(addr + baseReg, hex);
            }
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=ma.js.map