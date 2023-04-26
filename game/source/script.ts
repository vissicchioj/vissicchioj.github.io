module POM 
{

    export class Game
    {
        // public gameList = [];

        // public init(): void
        // {
        //     // Set list of games including their name, score, and image. Score is based off IGN reviews 
        //     //NOTE: this is a 2D array
        //     // parseFloat() will be your friend
        //     this.gameList = 
        //     [
        //         ["Mario Golf", "10.0", "INCLUDE SOURCE FOR IMAGES"], 
        //         ["Pokemon Red", "10.0", ""],
        //         ["The Legend of Zelda: Ocarina of Time", "10", ""],
        //         ["Super Mario 64", "9.8", ""],
        //         ["Golden Eye 007", "9.7", ""],
        //         ["Monster Rancher", "9.0", ""],
        //         ["Tekken 3", "9.3", ""],
        //         ["The Sims", "9.5", ""],
        //         ["Legend of Zelda: Majora's Mask", "9.9", ""],
        //         ["Mario Kart 64", "8.1", ""],
        //         ["Final Fantasy 7", "8.2", ""],
        //         ["Super Smash Bros. Melee", "9.6", ""],
        //         ["Mortal Kombat 3", "5.0", ""],
        //         ["Dragon Ball Budokai 3", "8.0", ""],
        //         ["NBA Jam Tournament Edition", "6.5", ""],
        //         ["Worms Armageddon", "6.0", ""],
        //         ["Fire Emblem Path of Radiance", "8.7", ""],
        //         ["Fire Emblem The Sacred Stones", "8.5", ""],
        //         ["Dragon Quest V", "8.9", ""],
        //         ["Pokemon Alpha Sapphire", "7.8", ""],
        //         ["Disgaea: Hour of Darkness", "9.2", ""],
        //         ["Sonic The Hedgehog (Sonic '06)", "4.8", ""],
        //         ["Demon's Souls", "9.4", ""],
        //         ["Banjo-Kazooie", "9.6", ""],
        //         ["Billy Hatcher", "7.7", ""],
        //         ["Sonic Adventure DX Director's Cut", "5.0", ""],
        //         ["Ultimate Marvel vs. Capcom 3", "8.5", ""],
        //         ["Hey You, Pikachu!", "6.0", ""],
        //         ["Pokémon Mystery Dungeon: Explorers of Sky", "4.8", ""],
        //         ["Star Wars Battlefront (2015)", "8.0", ""],
        //         ["Minecraft (PC)", "9.0", ""],
        //         ["Fortnite: Battle Royale", "9.6", ""],
        //         ["Binding of Issac: Rebirth", "9.0", ""],
        //         ["Metal Gear", "8.0", ""],
        //         ["Metal Gear Solid", "9.8", ""],
        //         ["Civilization V", "9.0", ""],
        //         ["Mortal Kombat II", "7.3", ""],
        //         ["Mega Man X", "9.0", ""],
        //         ["Mega Man Star Force: Dragon", "5.2", ""],
        //         ["Monster Rancher: EVO", "6.5", ""],
        //     ];

        //     document.getElementById('game1').innerHTML = this.gameList[0];
        //     document.getElementById('game2').innerHTML = this.gameList[1];
        // }
        // public compareGames(firstGame, secondGame, choice)
        // {
        //     if ( (parseFloat(firstGame[1]) > parseFloat(secondGame[1])) && (choice === true) )
        //     {
        //         // Correct answer
        //     }
        //     else if ( (parseFloat(secondGame[1]) > parseFloat(firstGame[1])) && (choice === false) )
        //     {
        //         // Correct answer
        //     }
        //     else
        //     {
        //         // Incorrect answer
        //     }
        // }
        // public randomize(gameList)
        // {

        // }
        public static btnStart_click(btn): void
        {
            //btn.disabled = true;
            //document.getElementById('helloMessage').innerHTML = "push";
            document.getElementById('rating1').innerHTML = "";
            document.getElementById('rating2').innerHTML = "";
            document.getElementById('btnStart').style.visibility = "hidden";
            document.getElementById('btnGr').style.visibility = "visible";
            document.getElementById('btnLs').style.visibility = "visible";
            document.getElementById('btnNext').style.visibility = "hidden";
            alert("IGN Rating Guessing Game! \nIn this game you will be given two games and you must guess which one has a higher rating according to IGN reviews.\nHit the game controller to go back.")
            _GameList = new GameList();

            _GameList.init();
        }

        public static btnRestart_click(btn): void
        {
            //btn.disabled = true;
            //document.getElementById('helloMessage').innerHTML = "push";
            document.getElementById('rating1').innerHTML = "";
            document.getElementById('rating2').innerHTML = "";
            document.getElementById('btnRestart').style.visibility = "hidden";
            document.getElementById('btnGr').style.visibility = "visible";
            document.getElementById('btnLs').style.visibility = "visible";
            document.getElementById('btnNext').style.visibility = "hidden";
            document.getElementById('game1').removeChild(_GameList.img1);
            document.getElementById('game2').removeChild(_GameList.img2);
            _GameList.init();
        }

        public static btnGr_click(btn): void
        {
            //_GameList.compareGames(_GameList.getCurrentGame(1), _GameList.getCurrentGame(2), true);
            //document.getElementById('helloMessage').innerHTML = "start";
            _GameList.compareGames(_GameList.currGame1, _GameList.currGame2, true);
            document.getElementById('btnGr').style.visibility = "hidden";
            document.getElementById('btnLs').style.visibility = "hidden";
        } 

        public static btnLs_click(btn): void
        {
            //_GameList.compareGames(_GameList.getCurrentGame(1), _GameList.getCurrentGame(2), false);
            _GameList.compareGames(_GameList.currGame1, _GameList.currGame2, false);
            document.getElementById('btnGr').style.visibility = "hidden";
            document.getElementById('btnLs').style.visibility = "hidden";
        } 

        public static btnNext_click(btn): void
        {
            document.getElementById('game1').removeChild(_GameList.img1);
            document.getElementById('game2').removeChild(_GameList.img2);
            _GameList.randomize(_GameList.gameList);
            document.getElementById('btnNext').style.visibility = "hidden";
            document.getElementById('rating1').innerHTML = "";
            document.getElementById('rating2').innerHTML = "";
            document.getElementById('btnGr').style.visibility = "visible";
            document.getElementById('btnLs').style.visibility = "visible";
        } 
    }
        
    
}