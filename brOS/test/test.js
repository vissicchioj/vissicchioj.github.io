function Glados() {
    this.version = 2112;
 
    this.init = function() {
       var msg = "Sup bro. Welcome to brOS!\n";
       msg += "Just click start and there should also be a sample user program loaded in for ya. ";
       msg += "Just type help if you're lost."
       alert(msg);
    };
 
    this.afterStartup = function() {
       // Test the 'ver' command.
       _KernelInputQueue.enqueue('v');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue('r');
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
 
       var code = "A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 FF EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 FF 00";

       setTimeout(function(){ document.getElementById("taProgramInput").value = code;}, 1000);
    };
 }