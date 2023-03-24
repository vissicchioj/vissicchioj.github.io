var TSOS;
(function (TSOS) {
    // Allocates and deallocates memory
    class MemoryManager {
        constructor() {
            this.memSegment1 = false;
            this.memSegment2 = false;
            this.memSegment3 = false;
            this.lob = 0x00;
            this.hob = 0x00;
            this.combinedByte = 0x000;
            this.byteFlipArray = [];
            this.memorySize = 256;
        }
        getAvailableMemSeg() {
            var baseReg = 0;
            if (this.memSegment1 === false) {
                baseReg = 0;
                this.memSegment1 = true;
            }
            else if (this.memSegment2 === false) {
                baseReg = 256;
                this.memSegment2 = true;
            }
            else if (this.memSegment3 === false) {
                baseReg = 512;
                this.memSegment3 = true;
            }
            else if (_krnDiskSystem.isFormatted === true) {
                baseReg = 768;
            }
            else {
                //set it to a flag to know there isn't space
                baseReg = -1;
            }
            return baseReg;
        }
        setAvailableMemSeg(pid) {
            var base = _Kernel.residentList[pid - 1].baseReg;
            if (base === 0) {
                this.memSegment1 = false;
            }
            else if (base === 256) {
                this.memSegment2 = false;
            }
            else if (base === 512) {
                this.memSegment3 = false;
            }
        }
        setAllAvailableMemSeg() {
            this.memSegment1 = false;
            this.memSegment2 = false;
            this.memSegment3 = false;
        }
        // Allocate User Input Program to memory
        allocateMem(baseReg, userProgram) {
            for (var i = 0; i < this.memorySize; i++) {
                var hex = parseInt(userProgram[i], 16);
                // A lot of programs will not fill the entire memory array so fill the rest with 00
                // if the value is not a number we make it 00
                if (isNaN(hex)) {
                    _Memory.setMem(i + baseReg, 0x00);
                }
                // The memory that the user inputted
                else {
                    _Memory.setMem(i + baseReg, hex);
                }
            }
        }
        getMemory(baseReg) {
            var memStr = "";
            var userProg = [];
            for (var i = 0; i < this.memorySize; i++) {
                var addZero = _Memory.getMem(i + baseReg).toString(16);
                if (addZero.length < 2) {
                    addZero = "0" + addZero;
                }
                memStr = memStr + addZero;
                //_StdOut.putText(memStr);
            }
            for (var i = 0; i < memStr.length; i += 2) {
                userProg.push(memStr.substring(i, i + 2));
            }
            //_StdOut.putText(userProg.join(""));
            return userProg;
        }
        // Resets memory
        deallocateMem() {
            _Memory.reset();
        }
        // Resets memory segment
        deallocateSegment(baseReg) {
            var baseStr = baseReg.toString(16);
            var base = parseInt(baseStr, 16);
            for (var i = base; i < base + 0x100; i++) {
                _Memory.memArray[i] = 0x00;
            }
        }
        //used to combine two bytes together in order to create a two byte number
        //this is used to implement little endian or to add to the ProgramCounter as seen in branch
        combineBytes(loByte, hoByte) {
            this.byteFlipArray[0] = hoByte;
            this.byteFlipArray[1] = loByte;
            this.combinedByte = ((this.byteFlipArray[0] << 8) | (this.byteFlipArray[1]));
            return this.combinedByte;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=mm.js.map