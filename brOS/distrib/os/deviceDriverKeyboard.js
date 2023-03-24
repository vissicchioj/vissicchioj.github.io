/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) {
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                }
                else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57)) || // digits
                (keyCode == 32) || // space
                (keyCode == 13) // enter
            ) {
                // conditional statements for special chars
                if (isShifted === true) {
                    //switch case for special chars
                    switch (keyCode) {
                        case 48:
                            chr = String.fromCharCode(41);
                            break;
                        case 49:
                            chr = String.fromCharCode(keyCode - 16);
                            break;
                        case 50:
                            chr = String.fromCharCode(64);
                            break;
                        case 51:
                            chr = String.fromCharCode(keyCode - 16);
                            break;
                        case 52:
                            chr = String.fromCharCode(keyCode - 16);
                            break;
                        case 53:
                            chr = String.fromCharCode(keyCode - 16);
                            break;
                        case 54:
                            chr = String.fromCharCode(94);
                            break;
                        case 55:
                            chr = '&';
                            break;
                        case 56:
                            chr = String.fromCharCode(42);
                            break;
                        case 57:
                            chr = '(';
                            break;
                        default:
                    }
                }
                else {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            }
            // backspace
            else if (keyCode == 8) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            // tab
            else if (keyCode == 9) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            // up key
            else if (keyCode == 38 || keyCode == 40) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            //remaining special chars
            else {
                if (isShifted === true) {
                    switch (keyCode) {
                        case 192:
                            chr = '~';
                            break;
                        case 189:
                            chr = '_';
                            break;
                        case 187:
                            chr = '+';
                            break;
                        case 219:
                            chr = '{';
                            break;
                        case 221:
                            chr = '}';
                            break;
                        case 220:
                            chr = '|';
                            break;
                        case 186:
                            chr = ':';
                            break;
                        case 222:
                            chr = '"';
                            break;
                        case 188:
                            chr = '<';
                            break;
                        case 190:
                            chr = '>';
                            break;
                        case 191:
                            chr = '?';
                            break;
                        default:
                    }
                }
                else {
                    switch (keyCode) {
                        case 192:
                            chr = '`';
                            break;
                        case 189:
                            chr = '-';
                            break;
                        case 187:
                            chr = '=';
                            break;
                        case 219:
                            chr = '[';
                            break;
                        case 221:
                            chr = ']';
                            break;
                        case 220:
                            chr = '\\';
                            break;
                        case 186:
                            chr = ';';
                            break;
                        case 222:
                            chr = '\'';
                            break;
                        case 188:
                            chr = ',';
                            break;
                        case 190:
                            chr = '.';
                            break;
                        case 191:
                            chr = '/';
                            break;
                        default:
                    }
                }
                _KernelInputQueue.enqueue(chr);
            }
        }
    }
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map