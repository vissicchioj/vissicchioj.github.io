
module TSOS
{
    export class Memory
    {

        // create the private array of memory
        public memArray = [];

        constructor(size: number)
        {
            // Set the size of the array based on Control.ts (768)
            this.memArray = new Array(size);
        }

        // initialize array as 0x00
        public init(): void {
            // Calls reset since the code will be the same otherwise
            this.reset();
        }

        //reset all members in the array to be 0x00
        public reset()
        {
            for(var i = 0x00; i < this.memArray.length; i++) 
            {
                this.memArray[i] = 0x00;
            }
        }

        // gets the hex code from an index in memory array
        public getMem(index: number)
        {
            var currHex = this.memArray[index];
            return currHex;
        }
 
        // sets the memory array index with a hex code
        public setMem(index: number, hex: number)
        {
            this.memArray[index] = hex;
        }
 
        // Set memory to a hexidecimal string 
        public toString()
        {
            var str = '';
            var currMemStr = '';
            for (var i = 0; i < this.memArray.length; i++)
            {
                // Current Hex Num in memory will turn into a Hex String
                currMemStr = this.memArray[i].toString(16).toUpperCase();
                if (currMemStr.length < 2)
                {
                    // Add padding zero
                    currMemStr = '0' + currMemStr;
                }
                // Add the hex num to the return string
                str = str + currMemStr + ' ';
            } 
            return str;
        }


    }
}