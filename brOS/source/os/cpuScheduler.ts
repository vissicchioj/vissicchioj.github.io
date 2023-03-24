module TSOS
{
    export class CpuScheduler
    {
        // Cpu Scheduler is in charge of checking whether or not a context switch should be occurring
        // IP3 only handles Round Robin Scheduling
        constructor
        (
            // default quantum is 6
            public quantum: number = 6,

            public prevQuantum: number = quantum,

            // after (quantum num) cycles the context switch occurs
            public cycleCounter: number = 0,

            //default schedule is Round Robin
            public sched: String = "RR",
        )
        {

        }

        public schedules()
        {
            switch(this.sched)
            {
                case "RR":
                    this.roundRobin();
                    break;
                case "FCFS":
                    this.firstComeFirstServe();
                    break;
                default:
                    _StdOut.putText("Error: Invalid schedule type.");
                
            }
        }

        public roundRobin()
        {
            // Needs to call the kernel interrupt for cpu dispatcher context switch
            if (_Kernel.readyQueue.getSize() > 0)
            {
                // Need to check if CPU's pcb exists or not first or else the context switch will never get called
                // Also context switch if the CPU's pcb is complete
                if (_CPU.pcb === null || _CPU.pcb.state === "Finished")
                {
                    _Kernel.krnInterruptHandler(CONTEXTSWITCH_IRQ, null);
                }
                else
                {
                    // The amount of clock cycles reached the quantum so call context switch via interrupt
                    if (this.cycleCounter >= this.quantum)
                    {
                        this.cycleCounter = 0;
                        _Kernel.krnInterruptHandler(CONTEXTSWITCH_IRQ, null);
                    }
                }
            }
        }

        public firstComeFirstServe()
        {
            this.quantum = Number.MAX_VALUE;
            this.roundRobin();
        }

        public setSchedule(schedule: String)
        {
            switch(schedule)
            {
                case "RR":
                    this.quantum = this.prevQuantum;
                    this.sched = schedule;
                    break;
                case "FCFS":
                    this.sched = schedule;
                    break;
                default:
                    _StdOut.putText("Error: Invalid schedule type.");
                
            }
        }
    }
}