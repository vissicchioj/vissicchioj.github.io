var TSOS;
(function (TSOS) {
    class DiskSystem {
        constructor(tracks = 4, sectors = 8, blocks = 8) {
            this.tracks = tracks;
            this.sectors = sectors;
            this.blocks = blocks;
        }
        init() {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
        }
    }
    TSOS.DiskSystem = DiskSystem;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=diskSystem.js.map