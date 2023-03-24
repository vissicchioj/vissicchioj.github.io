/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 0, currentYPosition = _DefaultFontSize, buffer = "") {
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            // past lines saved into an array
            this.bufferList = [];
            // this will keep track of what element of the array we are in
            this.line = -1;
        }
        init() {
            this.clearScreen();
            this.resetXY();
        }
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        resetXY() {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }
        handleInput() {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.bufferList.push(this.buffer);
                    this.line = this.bufferList.length;
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) // the Backspace key
                 {
                    // when we backspace we are taking the last character from the buffer
                    // we also need to update the canvas by clearing that last character and moving our cursor back
                    let tempStr = this.buffer.slice(-1);
                    this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                    let charWidth = TSOS.CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, tempStr);
                    this.currentXPosition = this.currentXPosition - charWidth;
                    // basically creates a transparent rectangle over the last character
                    // this looks, graphically, just like backspacing
                    _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, charWidth, _DefaultFontSize * 2);
                }
                else if (chr === String.fromCharCode(9)) // the Tab key
                 {
                    // ver auto completion
                    if (this.buffer === "v" || this.buffer === "ve") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('v');
                        _KernelInputQueue.enqueue('e');
                        _KernelInputQueue.enqueue('r');
                    }
                    // help auto completion
                    else if (this.buffer === "h" || this.buffer === "he" || this.buffer === "hel") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('h');
                        _KernelInputQueue.enqueue('e');
                        _KernelInputQueue.enqueue('l');
                        _KernelInputQueue.enqueue('p');
                    }
                    // shutdown auto completion
                    else if (this.buffer === "s" || this.buffer === "sh" || this.buffer === "shu" ||
                        this.buffer === "shut" || this.buffer === "shutd" || this.buffer === "shutdo" ||
                        this.buffer === "shutdow" || this.buffer === "status") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('s');
                        _KernelInputQueue.enqueue('h');
                        _KernelInputQueue.enqueue('u');
                        _KernelInputQueue.enqueue('t');
                        _KernelInputQueue.enqueue('d');
                        _KernelInputQueue.enqueue('o');
                        _KernelInputQueue.enqueue('w');
                        _KernelInputQueue.enqueue('n');
                    }
                    // cls auto completion
                    else if (this.buffer === "c" || this.buffer === "cl") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('c');
                        _KernelInputQueue.enqueue('l');
                        _KernelInputQueue.enqueue('s');
                    }
                    // man auto completion
                    else if (this.buffer === "m" || this.buffer === "ma") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('m');
                        _KernelInputQueue.enqueue('a');
                        _KernelInputQueue.enqueue('n');
                    }
                    // trace auto completion
                    else if (this.buffer === "t" || this.buffer === "tr" || this.buffer === "tra" ||
                        this.buffer === "trac") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('t');
                        _KernelInputQueue.enqueue('r');
                        _KernelInputQueue.enqueue('a');
                        _KernelInputQueue.enqueue('c');
                        _KernelInputQueue.enqueue('e');
                    }
                    // rot13 auto completion
                    else if (this.buffer === "r" || this.buffer === "ro" || this.buffer === "rot" ||
                        this.buffer === "rot1") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('r');
                        _KernelInputQueue.enqueue('o');
                        _KernelInputQueue.enqueue('t');
                        _KernelInputQueue.enqueue('1');
                        _KernelInputQueue.enqueue('3');
                    }
                    // prompt auto completion
                    else if (this.buffer === "p" || this.buffer === "pr" || this.buffer === "pro" ||
                        this.buffer === "prom" || this.buffer === "promp") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('p');
                        _KernelInputQueue.enqueue('r');
                        _KernelInputQueue.enqueue('o');
                        _KernelInputQueue.enqueue('m');
                        _KernelInputQueue.enqueue('p');
                        _KernelInputQueue.enqueue('t');
                    }
                    // date auto completion
                    else if (this.buffer === "d" || this.buffer === "da" || this.buffer === "dat") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('d');
                        _KernelInputQueue.enqueue('a');
                        _KernelInputQueue.enqueue('t');
                        _KernelInputQueue.enqueue('e');
                    }
                    // whereami auto completion
                    else if (this.buffer === "w" || this.buffer === "wh" || this.buffer === "whe" ||
                        this.buffer === "wher" || this.buffer === "where" || this.buffer === "wherea" ||
                        this.buffer === "wheream") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('w');
                        _KernelInputQueue.enqueue('h');
                        _KernelInputQueue.enqueue('e');
                        _KernelInputQueue.enqueue('r');
                        _KernelInputQueue.enqueue('e');
                        _KernelInputQueue.enqueue('a');
                        _KernelInputQueue.enqueue('m');
                        _KernelInputQueue.enqueue('i');
                    }
                    // stairs auto completion, can tab stairs to change to status and vise versa
                    else if (this.buffer === "s" || this.buffer === "st" || this.buffer === "sta" ||
                        this.buffer === "stai" || this.buffer === "stair" || this.buffer === "shutdown") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('s');
                        _KernelInputQueue.enqueue('t');
                        _KernelInputQueue.enqueue('a');
                        _KernelInputQueue.enqueue('i');
                        _KernelInputQueue.enqueue('r');
                        _KernelInputQueue.enqueue('s');
                    }
                    // status auto completion, can tab stairs to change to status and vise versa
                    else if (this.buffer === "s" || this.buffer === "st" || this.buffer === "sta" ||
                        this.buffer === "stat" || this.buffer === "statu" || this.buffer === "stairs") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('s');
                        _KernelInputQueue.enqueue('t');
                        _KernelInputQueue.enqueue('a');
                        _KernelInputQueue.enqueue('t');
                        _KernelInputQueue.enqueue('u');
                        _KernelInputQueue.enqueue('s');
                    }
                    // bsod auto completion
                    else if (this.buffer === "b" || this.buffer === "bs" || this.buffer === "bso") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('b');
                        _KernelInputQueue.enqueue('s');
                        _KernelInputQueue.enqueue('o');
                        _KernelInputQueue.enqueue('d');
                    }
                    // load auto completion
                    else if (this.buffer === "l" || this.buffer === "lo" || this.buffer === "loa") {
                        this.clearLine();
                        _KernelInputQueue.enqueue('l');
                        _KernelInputQueue.enqueue('o');
                        _KernelInputQueue.enqueue('a');
                        _KernelInputQueue.enqueue('d');
                    }
                }
                //up and down keys
                else if (chr === String.fromCharCode(38) || chr === String.fromCharCode(40)) {
                    // NOTE: since we are using push we have to kind of work in a reverse matter
                    // ex) when we press up we actually are looking at the top (last element) of the array
                    var chrArray = [];
                    if (chr === String.fromCharCode(40) && this.line <= this.bufferList.length - 1) {
                        //clear the line
                        this.clearLine();
                        //iterate
                        this.line++;
                        // [...string] will turn a string into an array of chars
                        chrArray = [...this.bufferList[this.line]];
                        for (let k = 0; k < chrArray.length; k++) {
                            // enqueue each character from a previous line
                            _KernelInputQueue.enqueue(chrArray[k]);
                        }
                    }
                    if (chr === String.fromCharCode(38) && this.line > 0) {
                        this.clearLine();
                        //iterate
                        this.line--;
                        // [...string] will turn a string into an array of chars
                        chrArray = [...this.bufferList[this.line]];
                        for (let k = 0; k < chrArray.length; k++) {
                            // enqueue each character from a previous line
                            _KernelInputQueue.enqueue(chrArray[k]);
                        }
                    }
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }
        putText(text) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                //once we reach the end of the canvas, continue typing below
                let lastChr = this.buffer.slice(-1);
                let chrWidth = TSOS.CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, lastChr);
                if (this.currentXPosition >= _Canvas.width - chrWidth) {
                    this.advanceLine();
                }
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        }
        advanceLine() {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
            // Once we reach the bottom of the canvas
            if (this.currentYPosition >= _Canvas.height) {
                // get the image data of the canvas (basically a screenshot)
                const myImageData = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
                // clear it so nothing overwrites itself
                this.clearScreen();
                // put the image back but slightly above the canvas
                // NOTE: -1.5 keeps the line spacing correct, -1 would make the spacing really tight
                _DrawingContext.putImageData(myImageData, 0, -1.5 * this.currentFontSize);
                //put the y position at the bottom so it looks like its continuing at the bottom 
                this.currentYPosition = _Canvas.height - this.currentFontSize;
            }
        }
        //clears current line
        clearLine() {
            for (let i = 0; i < this.buffer.length; i++) {
                //backspace till its empty
                let bsp = String.fromCharCode(8);
                _KernelInputQueue.enqueue(bsp);
            }
        }
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map