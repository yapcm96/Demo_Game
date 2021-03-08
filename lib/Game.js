import inquirer from 'inquirer';
import {Player} from '../lib/Player.js';
import _ from 'lodash';
import { Cyclops } from './Cyclops.js';
import { Snake } from './Serpent.js';
import { Wolf } from './Wolf.js';
import chalk from 'chalk';


// Countdown timer for in-game decisions
export class Timer {
    constructor(timeLimit) {
        this.timeLimit = timeLimit;
        this.currentTimeLeft;
    }
    async start() {
        async function wait() {
            await new Promise(resolve => setTimeout(resolve, 1000)); 
        }
        for(let i = this.timeLimit; i > 0; i--) {
            this.currentTimeLeft = i; 
            await wait();
            if (i == 1) {
                console.log(chalk.red("\n Time has run out, game over!"))
                process.exit(); 
            }
        }
    }
} 

// Main game function
export class Game {
    constructor() {
        this.battleNumber = 0;
        this.isPlayerTurn = false;
        this.enemies = [];
        this.currentEnemy;
        this.player;
        this.roundNumber = 0;
        this.timer = new Timer(300);
        // Could amalgamate games counts using object destructuring 
        this.gamesPlayed = 0;
        this.gamesWon = 0;
        this.gamesLost = 0;
    }

    // Initialise the game
    initializeGame() {
        // create enemies and put into array
        this.enemies.push(new Wolf('three-headed wolf', 'claw'));
        this.enemies.push(new Snake('serpent', 'fang'));
        this.enemies.push(new Cyclops('skeletocyclops', 'axe'));
        // randomise order of enemies
        this.shuffledEnemies = _.shuffle(this.enemies);
        this.resetIndexEnemies = this.shuffledEnemies.filter(function(){return true;});
        this.currentEnemy = this.resetIndexEnemies[0];

        // asks player to play the game with the terminal expanded fully
        console.log(chalk.cyan("NOTE: This game is best played with the terminal expanded to a full window!"))

        // prompts the player for their name and narrates the story
        inquirer
            .prompt({
                type: 'text',
                name: 'name',
                message: 'Please tell us your name young squire ... so we can remember you, should you succumb to the fate that awaits you.\n'
            })
            // destructure name from the prompt object
            .then(({ name }) => {
                this.player = new Player(name);
                this.timer.start();
                console.log(`\n${name} has awaken and picks up a 📗book📗`)
                console.log(`'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light🌕, it was the season of Darkness🌑, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way...'`)
                console.log(`You find yourself in a deep, dark dungeon. Liberate all the creatures to escape. Use Beyonces to help you. \n`)
    
                // placeholder for starting a new round
                this.door();
            });
    };

    // Prompts for door choice. If chosen door is correct, player continues, but is game over if otherwise.
    door(){
        inquirer
            .prompt({
                type: 'list',
                name: 'action',
                message: 'Light and Darkness are sometimes intertwined, which door will you choose?',
                choices: ['Light','Dark','Live']
            })
            .then(({ action }) => {
                console.log(`
    		                        		  nO eNtRy                             
			                        	 ____________                          
			                        	|            |                         
			                        	|            |                         
			                        	|            |                         
				                        |        ()  |                         
				        ${chalk.bgGreen(`vvvv`)}            |            |             ${chalk.bgGreen(`vvvv`)}        
				    ${chalk.bgGreen(`vvvvvvvvvvvv`)}        |            |         ${chalk.bgGreen(`vvvvvvvvvvvv`)}    
				${chalk.bgGreen(`vvvvvvvvvvvvvvvvvvvv`)}    |____________|     ${chalk.bgGreen(`vvvvvvvvvvvvvvvvvvvv`)}
			                        	   ...creak!                               `);

                // Light and Dark door are completely randomised to be correct on either one
                if (action == _.sample(['Light','Dark'])) {
                    console.log(`${chalk.green(`\n Well done warrior, you have opened the correct door\n`)}`)

                    this.startNewBattle();
                    } else if( action === 'Live'){
                        console.log(`${chalk.cyan(`\nYou have opened the safe door, continue with your journey warrior\n`)}`)
                        this.startNewBattle();
                    }
                    else{
                        console.log(`${chalk.red(`\nYou must not deviate away from Light. Game over\n`)}`)
                        process.exit()
                    }
            })
    }
    
    // Starts a new battle upon entering the correct door or when an enemy is defeated
    startNewBattle() {       
        if (this.player.agility > this.currentEnemy.agility) {
            this.isPlayerTurn = true;
        }  else {
            this.isPlayerTurn = false;
        }
        console.log('Your stats are as follows:');
        console.table(this.player.getStats());
        console.log(this.currentEnemy.getDescription());
        this.battle();
    };
    
    // Execute battle action
    battle() {
        // execute if it is player's turn
        if (this.isPlayerTurn) {
            this.roundNumber++;
            console.log(this.currentEnemy.sprite)
            console.log(``);
            console.log(`-----Round ${this.roundNumber}-----You have ${chalk.green(this.timer.currentTimeLeft)} seconds left to finish the game!`);
            inquirer
                .prompt({
                    type: 'list',
                    message: 'What would you like to do?',
                    name: 'action',
                    choices: ["Tame🤝", "Use Revive💕", "Poison🍷", "Do Nothing🤐😴"]
                })
                .then(({ action }) => {
                    if (action === 'Use Revive💕') {
                        // No potions to use
                        if (!this.player.getInventory()) {
                            console.log("You don't have any Beyonces (revive) to the left, to the left!");
                            return this.checkEndOfBattle();
                        }
                        
                        // Player uses potion
                        inquirer
                            .prompt({
                                type: 'list',
                                message: 'Which Beyonce (revive) would you like to use?',
                                name: 'action',
                                // utilising map function to specify index and string literal in console
                                choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                            })
                            // callback for acceptance / rejection of Promise of specified action
                            .then(({ action }) => {
                                const reviveDetails = action.split(': '); // split ---> ['1','health']
                                this.player.useRevive(reviveDetails[0] - 1);
                                console.log(`You used a ${reviveDetails[1]} Beyonce (revive).`);
    
                                this.checkEndOfBattle(); // check alive statuses of player and enemy
                            });
                    } else if (action === 'Poison🍷') {
                        // player poisons enemy                   
                        if (this.currentEnemy.status == chalk.magenta('Poisoned')) {
                            console.log('Enemy has already been poisoned!')
                        } else {
                            this.currentEnemy.status = chalk.magenta('Poisoned');
                            console.log(`You poisoned the ${this.currentEnemy.name}`)
                        }

                        this.checkEndOfBattle(); // check alive statuses of player and enemy
                    } else if (action === 'Tame🤝') {
                        // player tames enemy
                        const damage = this.player.getAttackValue();
                        this.currentEnemy.reduceHealth(damage);
    
                        console.log(`You attacked the ${this.currentEnemy.name}`);
                        console.log(this.currentEnemy.getHealth());
    
                        this.checkEndOfBattle(); // check alive statuses of player and enemy
                    } else if (action === 'Do Nothing🤐😴') {
                        console.log(`You flail around like a useless Magikarp. ${this.currentEnemy.name} looks at you confusingly.`);
    
                        this.checkEndOfBattle(); // check alive statuses of player and enemy
                    }
                });
        }
        // execute if it is enemy's turn
        else {
            // enemy attacks
            const damage = this.currentEnemy.getAttackValue();
            this.player.reduceHealth(damage);
    
            console.log(`You were attacked by the ${this.currentEnemy.name} (${this.currentEnemy.status})`);
            console.log(this.player.getHealth());
    
            this.checkEndOfBattle(); // check alive statuses of player and enemy
        }
    };
    
    // Applies battle effects and check alive conditions at the end of the turn
    checkEndOfBattle() {
        // recover health if have LifeSteal Fang and when enemy attacks
        if (!this.isPlayerTurn) {
            this.currentEnemy.getRecoverHealth(); 
        }

        // damage if have poisoned status
        this.currentEnemy.getPoisonedDamage();

        // executes if player and enemy is alive
        if (this.player.isAlive() && this.currentEnemy.isAlive()) {
            this.isPlayerTurn = !this.isPlayerTurn;

            this.battle();
        } 
        // executes if player is alive but enemy is dead
        else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
            console.log(`\nYou've successfully tamed the ${this.currentEnemy.name}`);
    
            this.player.addRevive(this.currentEnemy.potion);
            console.log(`${this.player.name} found a(n) ${this.currentEnemy.potion.name} Beyonce \n`);
    
            this.battleNumber++;
    
            // constraining 'levels' of game to amount of defined enemies
            if (this.battleNumber < this.enemies.length) {
                this.currentEnemy = this.resetIndexEnemies[this.battleNumber];
                this.startNewBattle();
            } else if (this.battleNumber == this.enemies.length) {
                console.log(`You win! ${this.player.getName()} has successfully tamed all the suffering creatures in your dungeon. The purified creatures awake and shine brightly, becoming your mythical pets. You meet others who have overcome their challenges. Together on a path of Light towards a new world will you maintain in Light, or surrender to the season of Darkness..\n`);

                inquirer
                .prompt({
                    type: 'list',
                    name: 'action',
                    message: `Would you like to test fate and play again, ${chalk.blue(this.player.getName())}?\n`,
                    choices: ['Yes', 'No']
                })
                .then(({ action }) => {
                    if (action == 'Yes') {
                        // resets game state
                        this.battleNumber = 0;
                        this.isPlayerTurn = false;
                        this.enemies = [];
                        this.roundNumber = 0;
                        this.timer = new Timer(300);
                        // starts a new game
                        this.initializeGame(); 
                        // increments number of games played and won
                        this.gamesPlayed++;
                        this.gamesWon++; 
                        console.log(`Total Games Played: + ${this.gamesPlayed}`); 
                        console.log(`Total Games Won: + ${this.gamesWon}`);
                        console.log(`Total Games Lost: + ${this.gamesLost}`);
                    }
                    else {
                        process.exit(); 
                    }
                })
            }
        }
        // if we don't meet the above conditions i.e. player is dead
        else {
            console.log("\nYou've been defeated! The dark path ahead lies. Nothing to be seen, nothing to be heard...\n");
            inquirer
            .prompt({
                type: 'list',
                name: 'action',
                message: `Would you like to test fate and play again, ${chalk.blue(this.player.getName())}?\n`, 
                choices: ['Yes', 'No']
            })
            .then(({ action }) => {
                if (action == 'Yes') {
                    // resets game state
                    this.battleNumber = 0;
                    this.isPlayerTurn = false;
                    this.enemies = [];
                    this.roundNumber = 0;
                    this.timer = new Timer(300);
                    // starts a new game
                    this.initializeGame();
                    // increments number of games played and lost
                    this.gamesPlayed++;
                    this.gamesLost++;
                    console.log(`Total Games Played: + ${this.gamesPlayed}`); 
                    console.log(`Total Games Won: + ${this.gamesWon}`);
                    console.log(`Total Games Lost: + ${this.gamesLost}`);
                }
                else {
                    process.exit(); 
                }
            })                
        }
    }
};
