module TSOS
{
    export class ProcessControlBlock
    {
        constructor
            (
            public pid: number = -1,
            public state: String = '',
            public location: String = '-',
            public priority: number = 0,
            public pc: number = 0,
            public acc: number = 0,
            public xreg: number = 0,
            public yreg: number = 0,
            public zflag: number = 0,
            public baseReg: number = 0,
            public limitReg: number = 0,
            public turnaround: number = 0,
            public wait: number = 0,
            public calc: boolean = false,
            public diskKey: string = "",
            public userProg: Array<string> = []
            ) 
        {

        }

        public init(): void {
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

        // PCB should not be loading or running programs instead we'll leave that to the kernel
        
        // // Loading a program into memory
        // public load(userProgram: Array<string>)
        // {
        //     // Loading again overwrites memory, so reset it first
        //     _MM.deallocateMem(); 

        //     // Memory Manager allocates the User Program into memory
        //     _MM.allocateMem(userProgram);

        //     // change state
        //     this.state = "Resident";

        //     // Update the PCB table with values
        //     TSOS.Control._SetPcbTable();
        // }

        // // Running a program in memory
        // public run()
        // {
        //     // change state
        //     this.state = "Running";

        //     // Update the PCB table with values
        //     TSOS.Control._SetPcbTable();

        //     // Tell the CPU to begin executing
        //     if (TSOS.Control._SingleStep === true)
        //     {
        //         // Waiting on Step button clicks
        //     }
        //     else
        //     {
        //         _CPU.isExecuting = true;
        //     }
        // }


    }
}