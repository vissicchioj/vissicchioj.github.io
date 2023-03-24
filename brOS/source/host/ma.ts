module TSOS
{
    // Read and Writes Memory
    export class MemoryAccessor
    {

        constructor(){
        }

        /*
            IP3:
                read and write will also need to take in base and limit registers as well. The address that we need will
                be located via adding addr to the base register
            
        */
        public read(baseReg: number, limitReg: number, addr: number)
        {
            if (addr + baseReg >= limitReg)
            {
                _CPU.isExecuting = false;
                _StdOut.putText("Error: Memory out of bounds! Killing all processes...");
                _OsShell.shellKillAll(null);
                _StdOut.advanceLine();
            }
            else
            {
                return _Memory.getMem(addr + baseReg);
            }
        }

        public write(baseReg, limitReg: number, addr: number, hex: number)
        {
            if (addr + baseReg >= limitReg)
            {
                _CPU.isExecuting = false;
                _StdOut.putText("Error: Memory out of bounds! Killing all programs...");
                _OsShell.shellKillAll(null);
                _StdOut.advanceLine();
            }
            else
            {
                _Memory.setMem(addr + baseReg, hex);
            }
        }
    }
}