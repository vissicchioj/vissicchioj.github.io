/* ----------------------------------
   DeviceDriverDiskSystem.ts

   The Kernel Device Driver Disk System
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverDiskSystem extends DeviceDriver {

        constructor(
            public isFormatted: boolean = false
        ) {
            super();
            this.driverEntry = this.krnDsddDriverEntry;
        }

        public krnDsddDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk System Device Driver.
            this.status = "loaded";
            
        }

        public format()
        {
            //tracks
            for (var t = 0; t < 4; t++)
            {
                //sectors
                for (var s = 0; s < 8; s++)
                {
                    //blocks
                    for (var b = 0; b < 8; b++)
                    {
                        var val = "";
                        // Check for MBR
                        if (t == 0 && s == 0 && b == 0)
                        {
                            val += "1000"; // key (0,0,0) (aka mbr) will have 1 for inUse and 000 for next
                            for (var i = 0; i < 60; i++)
                            {
                                // Data will be filled with -
                                val += "- ";
                            }
                        }
                        else
                        {
                            val += "0000";
                            for (var i = 0; i < 60; i++)
                            {
                                val += "- ";
                            }
                        }

                        sessionStorage.setItem(t + "," + s + "," + b, val)
                    }
                }
            }
            _StdOut.putText("Disk Format Successful!");
            this.isFormatted = true;
            TSOS.Control._setDiskTable();
        }

        public create(fileName: string, log: boolean)
        {  
            if (this.isFormatted)
            {
            // TODO: Check if fileName exists before adding a new one.
            var fileNameKey = this.findFileNameKey(fileName);

            if (fileNameKey === "")
            {
            var availableDir = this.findNextAvailableDir();
            var availableData = this.findNextAvailableData();

            // Remove all commas from the tsb string that returns from availableData as it will mess up my display.
            var availableDataNext = availableData.replace(/,/g, '');


            var strToHex = this.strToHex(fileName);

            // Create a value string 
            var newVal = "1" + availableDataNext + strToHex; // inUse = 1, Next = tsb string from avaialableData, valData = strToHex

            newVal = this.appendDashes(newVal);
            sessionStorage.setItem(availableDir, newVal);

            // Set the new data location that is next to inUse
            var availableDataVal = "1000"
            for (var j = 0; j < 60; j++)
            {
                availableDataVal += "- "
            }
            sessionStorage.setItem(availableData, availableDataVal);
            
            if (log === true)
            {
                _StdOut.putText("New file created: " + fileName);
            }

            TSOS.Control._setDiskTable();
            return availableDir;
        }
        else
        {
            _StdOut.putText("Error: Filename already in use.");
        }
        }
        else 
        {
            _StdOut.putText("Error: Must format disk first");
        }
        }

        public write(fileName: string, dataStr: string)
        {
            if (this.isFormatted)
            {
            // get the TSB key for the filename mentioned
            var fileNameKey = this.findFileNameKey(fileName);

            if (fileNameKey === "")
            {
                _StdOut.putText(fileName + " not found.");
            }
            else 
            {
            // get the next key by looking at the value within the current key
            var nextKey = sessionStorage.getItem(fileNameKey).substr(1,3);
            nextKey = this.appendCommas(nextKey);

            var hexDataStr = this.strToHex(dataStr);
            if(hexDataStr.length/2 > 60)
            {
                for (var i = 0; i < hexDataStr.length; i += 120)
                {
                    var j = 0;
                    var availableData = this.findNextAvailableData();
                    var availableDataNext = availableData.replace(/,/g, '');

                    var hexStrings = [];
                    hexStrings.push(hexDataStr.substring(i, i + 120));
                    if (hexStrings[j].length/2 < 60)
                    {
                        var newVal = "1***" + hexStrings[j];
                        newVal = this.appendDashes(newVal);
                        sessionStorage.setItem(availableData, newVal);
                    }
                    else 
                    {
                        var newVal = "1" + availableDataNext + hexStrings[j];
                        if (j == 0)
                        {
                            sessionStorage.setItem(nextKey, newVal);
                        }
                        else
                        {
                        sessionStorage.setItem(availableData, newVal);
                        }
                    }
                    
                    j++;
                }
            }
            else
            {
            var newVal = "1***" + hexDataStr;

            newVal = this.appendDashes(newVal);

            // With the nextKey and the dataStr turned into hex, our key and value is set in session storage.
            sessionStorage.setItem(nextKey, newVal);
            }

            _StdOut.putText("Data written to " + fileName);
            TSOS.Control._setDiskTable();
            }
        }
        else 
        {
            _StdOut.putText("Error: Must format disk first");
        }
        }

        public write6502(fileName: string, userInput: string)
        {
            // get the TSB key for the filename mentioned
            var fileNameKey = this.findFileNameKey(fileName);

            // get the next key by looking at the value within the current key
            var nextKey = sessionStorage.getItem(fileNameKey).substr(1,3);
            nextKey = this.appendCommas(nextKey);

            //userInput = "1***" + userInput;

            //sessionStorage.setItem(nextKey, userInput);

            var hexDataStr = userInput;
            // if(hexDataStr.length > 60)
            // {
            //     var j = 0;
            //     var hexStrings = [];
            //     for (var i = 0; i < hexDataStr.length; i += 60)
            //     {
            //         // var j = 0;
            //         var availableData = this.findNextAvailableData();
            //         var availableDataNext = availableData.replace(/,/g, '');

            //         // var hexStrings = [];
            //         hexStrings.push(hexDataStr.substring(i, i + 60));
            //         if (hexStrings[j].length < 60)
            //         {
            //             var newVal = "1***" + this.appendZeroes(hexStrings[j]);
            //             //newVal = this.appendZeroes(newVal);
            //             sessionStorage.setItem(availableData, newVal);
            //         }
            //         else 
            //         {
            //             var newVal = "1" + availableDataNext + hexStrings[j];
            //             if (j == 0)
            //             {
            //                 sessionStorage.setItem(nextKey, newVal);
            //             }
            //             else
            //             {
            //                 sessionStorage.setItem(availableData, newVal);
            //             }
            //         }
                    
            //         j++;
            //     }
            // }
            // else
            // {
            //     var newVal = "1***" + this.appendZeroes(hexDataStr);

            // //newVal = this.appendZeroes(newVal);

            // // With the nextKey and the dataStr turned into hex, our key and value is set in session storage.
            // sessionStorage.setItem(nextKey, newVal);
            // }
            hexDataStr = "1***" + hexDataStr;

            sessionStorage.setItem(nextKey, hexDataStr);

            //_StdOut.putText("Data written to " + fileName);
            TSOS.Control._setDiskTable();
            
        }

        public read(fileName: string)
        {
            if (this.isFormatted)
            {
            var fileNameKey = this.findFileNameKey(fileName);
            if (fileNameKey === "")
            {
                _StdOut.putText(fileName + " not found.");
            }
            else 
            {
            var nextKey = sessionStorage.getItem(fileNameKey).substr(1,3);
            nextKey = this.appendCommas(nextKey);

            // Get the hexString from file by removing all -
            var hexStr = "";
            hexStr = hexStr + sessionStorage.getItem(nextKey).replace(/- /g, '').trim().substr(4, 120);
            var i = 0;
            while (sessionStorage.getItem(nextKey).replace(/- /g, '').trim().substr(1, 3) !== "***")
            {
                nextKey = sessionStorage.getItem(nextKey).substr(1,3);
                nextKey = this.appendCommas(nextKey);
                hexStr = hexStr + sessionStorage.getItem(nextKey).replace(/- /g, '').trim().substr(i + 4, i+120);
                i += 120
            }
            var dataStr = this.hexToStr(hexStr);

            _StdOut.putText("Contents of " + fileName + ": ");
            // read out the dataStr to user
            _StdOut.putText(dataStr);

            // to use for copy
            return dataStr;
            }
        }
        else 
        {
            _StdOut.putText("Error: Must format disk first");
        }
        }

        public delete(fileName: string)
        {
            if (this.isFormatted)
            {
            var fileNameKey = this.findFileNameKey(fileName);
            if (fileNameKey === "")
            {
                _StdOut.putText(fileName + " not found.");
            }
            else 
            {
            var fileNameData = sessionStorage.getItem(fileNameKey);

            // Set inUse to 0 so it is available to be replaced but dont remove the data
            var removeInUse = fileNameData.replace("1", "0");
            sessionStorage.setItem(fileNameKey, removeInUse);
            _StdOut.putText("File: " + fileName + " has been deleted.");
            TSOS.Control._setDiskTable();
            }
        }
        else 
        {
            _StdOut.putText("Error: Must format disk first");
        }
        }

        public copy(oldFileName: string, newFileName: string)
        {
            if (this.isFormatted)
            {
            var fileNameKey = this.findFileNameKey(oldFileName);
            if (fileNameKey === "")
            {
                _StdOut.putText(oldFileName + " not found.");
            }
            else{
            // Create the newFileName
            this.create(newFileName, true);
            _StdOut.advanceLine();

            // Read the contents of the oldFileName to return what's there
            var copiedStr = this.read(oldFileName);
            _StdOut.advanceLine();

            // Write the contents of the oldFileName to the newFileName
            this.write(newFileName, copiedStr);
            _StdOut.advanceLine();

            _StdOut.putText(oldFileName + " has been copied to " + newFileName);
            _StdOut.advanceLine();
            TSOS.Control._setDiskTable();
            }
        }
        else 
        {
            _StdOut.putText("Error: Must format disk first");
        }
        }

        public rename(oldFileName: string, newFileName: string)
        {
            if (this.isFormatted)
            {
            var oldFileNameKey = this.findFileNameKey(oldFileName);
            if (oldFileNameKey === "")
            {
                _StdOut.putText(oldFileName + " not found.");
            }
            else 
            {
                //var count = 0;
                var fileNameData = sessionStorage.getItem(oldFileNameKey).replace(/- /g, '').trim();
                var removeFileName = fileNameData.substr(0,4);

                var hexNewFileName = this.strToHex(newFileName);
                var renamedFile = removeFileName + hexNewFileName;

                renamedFile = this.appendDashes(renamedFile);

                sessionStorage.setItem(oldFileNameKey, renamedFile);
                //_StdOut.putText(count + "");
                _StdOut.putText(oldFileName + " has been renamed to "+ newFileName+ ".");
                TSOS.Control._setDiskTable();
            }
        }
        else 
        {
            _StdOut.putText("Error: Must format disk first");
        }
        }

        public ls()
        {
            if (this.isFormatted)
            {
            var fileNames = [];

            // go through DIR and add eveery fileName inUse to fileNames
            for (var s = 0; s < 8; s++)
            {
                for (var b = 0; b < 8; b++)
                {
                    var valData = sessionStorage.getItem("0," + s + "," + b);
                    var hexFileName = valData.substr(4, valData.length).replace(/- /g, '');
                    if (hexFileName === '')
                    {

                    }
                    else
                    {
                        // Check that the data is inUse
                        if (valData.charAt(0) === "1" && valData.charAt(4) !== '7' && valData.charAt(5) !== 'e')
                        {
                            var strFileName = this.hexToStr(hexFileName);
                            fileNames.push(strFileName);
                        }
                    }
                }
            }

            for (var i = 0; i < fileNames.length; i++)
            {
                _StdOut.putText(fileNames[i]);
                _StdOut.advanceLine();
            }
        }
        else 
        {
            _StdOut.putText("Error: Must format disk first");
        }
        }

        public rollIn(pid: number, baseReg: number, limitReg: number)
        {
            var key = _Kernel.residentList[pid].diskKey;

            var dataStr = sessionStorage.getItem(key);
            var removeInUse = dataStr.replace("1", "0");
            sessionStorage.setItem(key, removeInUse);
            var nextKey = sessionStorage.getItem(key).substr(1,3);

            nextKey = this.appendCommas(nextKey);
            var memProg = [];
            var userProg = sessionStorage.getItem(nextKey);
            userProg = sessionStorage.getItem(nextKey).substr(4, userProg.length);
            var remove = sessionStorage.getItem(nextKey).replace("1", "0");
            sessionStorage.setItem(nextKey, remove);
            var i = 0;
            while (sessionStorage.getItem(nextKey).substr(1, 3) !== "***")
            {
                nextKey = sessionStorage.getItem(nextKey).substr(1,3);
                nextKey = this.appendCommas(nextKey);
                remove = sessionStorage.getItem(nextKey).replace("1", "0");
                //removeInUse = dataStr.replace("1", "0");
                sessionStorage.setItem(nextKey, remove);
                userProg = userProg + sessionStorage.getItem(nextKey).substr(i + 4, i+60);
                i += 60
            }
            for(var i = 0; i < userProg.length; i += 2)
            {
                memProg.push(userProg.substring(i, i + 2));
            }
            //_MM.deallocateMem();
            // Only remove the segment in memory before reallocating memory in case of different programs
            _MM.deallocateSegment(baseReg);
            _MM.allocateMem(_Kernel.residentList[pid].baseReg, memProg)

            TSOS.Control._SetMemTable();
            TSOS.Control._SetPcbTable();
            TSOS.Control._setDiskTable();
        }

        public rollOut(pid: number, userProgram: string[])
        {
            var userProg = userProgram.join('');

            //var memSegStr = _MM.memoryString(_Kernel.residentList[pid].baseReg, _Kernel.residentList[pid].limitReg)

            // PCB being rolledOut will be given a dir in disk
            var availableDir = this.findNextAvailableDir();
            _Kernel.residentList[pid].diskKey = availableDir;
            this.create("~" + pid, false);
            //var availableData = this.findNextAvailableData();
            //_Kernel.residentList[pid].location = "Disk";
            // _Kernel.residentList[pid].baseReg = 768;
            // _Kernel.residentList[pid].limitReg = 768;
            //var userP = _Memory.segmentToString(_Kernel.residentList[pid].baseReg)
            //this.write6502("~" + pid, userProg);
            var nextKey = sessionStorage.getItem(availableDir).substr(1,3);
            nextKey = this.appendCommas(nextKey);

            // var j = 0;
            // var hexStrings = [];

            // if(userProg.length > 60)
            // {
            //     var j = 0;
            //     var hexStrings = [];
            //     for (var i = 0; i < 300/*userProg.length*/; i += 60)
            //     {
            //         //var j = 0;
            //         var availableData = this.findNextAvailableData();
            //         var availableDataNext = availableData.replace(/,/g, '');

            //         //var hexStrings = [];
            //         hexStrings.push(userProg.substring(i, i + 60));
            //         if (hexStrings[j].length < 60)
            //         {
            //             var newVal = "1***" + hexStrings[j];
            //             //newVal = this.appendZeroes(newVal);
            //             sessionStorage.setItem(availableData, newVal);
            //         }
            //         else 
            //         {
            //             var newVal = "1" + availableDataNext + hexStrings[j];
            //             if (j == 0)
            //             {
            //                 sessionStorage.setItem(nextKey, newVal);
            //             }
            //             else
            //             {
            //             sessionStorage.setItem(availableData, newVal);
            //             }
            //         }
                    
            //         j++;
            //     }
            // }
            // else
            // {
            //     userProg = "1***" + userProg;
            //     sessionStorage.setItem(nextKey, userProg);
            // }

            userProg = "1***" + userProg;

            sessionStorage.setItem(nextKey, userProg);

            TSOS.Control._SetMemTable();
            TSOS.Control._SetPcbTable();
            TSOS.Control._setDiskTable();
        }

        public appendZeroes(dataStr: string): string
        {
            // Zeroes will be needed when placing string back in memory
            var newStr = dataStr;

            // Calculate remainingValData by subtracting space used from 64
            var remainingValData = 64 - (4 + newStr.substr(4, newStr.length).length);
            for (var i = 0; i < remainingValData; i++)
            {
                newStr += "0"
            }
            return newStr;
        }

        public appendDashes(dataStr: string): string
        {
            var newStr = dataStr;

            // Calculate remainingValData by subtracting space used from 64
            var remainingValData = 64 - (4 + newStr.substr(4, newStr.length).length/2);
            //var count = 0;
            for (var i = 0; i < remainingValData; i++)
            {
                newStr += "- "
                // Count to check if the amount of dashes are correct
                //count++;
            }
            //_StdOut.putText(count + "");
            return newStr;
        }

        // Will need to add commas when taking the next key and using it as a current key
        public appendCommas(key: string): string
        {
            var newStr = key;
            var charArr = [...newStr];
            charArr[0] = charArr[0] + ",";
            charArr[1] = charArr[1] + ",";
            newStr = charArr.join("");
            return newStr;
        }


        public findFileNameKey(fileName: string): string
        {
            var key = "";
            var found = false;
            for (var s = 0; s < 8; s++)
            {
                for (var b = 0; b < 8; b++)
                {
                    var itemLength = sessionStorage.getItem("0," + s + "," + b).length;

                    // use this find the fileName with -
                    var dataVal = sessionStorage.getItem("0," + s + "," + b).substr(4, itemLength);

                    // remove all - from the dataVal
                    var hexFileName = dataVal.replace(/- /g, '').trim();
                    var getFileName = this.hexToStr(hexFileName);
                    if (getFileName === fileName && found === false)
                    {
                        key = "0," + s + "," + b;
                        found = true;
                    }
                }
            }

            return key;
        }

        public findNextAvailableDir(): string
        {
            // Search through Dir until inUse = 0, meaning its available 
            var dirKey = ""
            var found = false;
            for (var s = 0; s < 8; s++)
            {
                for (var b = 0; b < 8; b++)
                {
                    var inUse = sessionStorage.getItem("0," + s + "," + b).charAt(0);
                    if (inUse === "0" && found === false)
                    {
                        dirKey = "0," + s + "," + b;
                        found = true;
                    }
                }
            }
            return dirKey;
        }

        public findNextAvailableData(): string
        {
            // Search through Data until inUse = 0, meaning its available 
            var dataKey = ""
            var found = false;
            for (var t = 1; t < 4; t++)
            {
                for (var s = 0; s < 8; s++)
                {
                    for (var b = 0; b < 8; b++)
                    {
                        var inUse = sessionStorage.getItem(t + "," + s + "," + b).charAt(0);
                        if (inUse === "0" && found === false)
                        {
                            dataKey = t + "," + s + "," + b;
                            found = true;
                        }
                    }
                }
            }
            return dataKey;
        }

        public strToHex(str: string): string
        {
            var hexNums = "";
            for (var i = 0; i < str.length; i++)
            {
                hexNums += str.charCodeAt(i).toString(16);
            }
            return hexNums;
        }

        public hexToStr(hex: string): string
        {
            var str = "";
            // every two hex digits is an ascii char
            for (var i = 0; i < hex.length; i+= 2)
            {
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
            }
            return str;
        }

    }
}