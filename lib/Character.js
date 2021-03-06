import chalk from 'chalk'
import {Game} from './Game.js'

export class Character {
    constructor(name = '') {
        this.name = name;
        this.health = Math.floor(Math.random() * 10 + 95);
        this.strength = Math.floor(Math.random() * 5 + 7);
        this.agility = Math.floor(Math.random() * 5 + 7);
        this.status = 'Normal status';
        this.armor = null;
    }

    isAlive() {
        if (this.health === 0) {
            return false;
        }
        return true;
    }

    getHealth() {
        return `${this.name}'s health is now ${this.health}!`;
    }
    
    getAttackValue() {
        const min = this.strength - 5;
        const max = this.strength + 5;

        //Arbitrary range for attack value based on pseudo-random JS number generator
        // Math.floor used to round to greatest integer (could also use Math.round)
        return Math.floor(Math.random() * (max - min) + min);
    }

    reduceHealth(damage) {
        let protection = 0;
        switch(this.armor) {
            case 'Fur':
                protection = 1;
                break;
            case 'Silver Scales':
                protection = 3;
                break;
            case 'Golem Armor':
                protection = 5;
                break;
        }
        // console.log(protection)
        // console.log(damage)
        if ((protection-damage) < 0) {
            this.health += (protection-damage);
        }

        if (this.health < 0) {
            this.health = 0;
        }
    }

    // applies damage from poisoned status every round ends
    getPoisonedDamage() {
        if (this.status == chalk.magenta('Poisoned')) {
            let poisonDamage = Math.floor(Math.random() * 10)
            this.health -= poisonDamage;

            if (this.health < 0) {
                this.health = 0;
            }

            console.log(`${this.name} is taking damage from poisoning! ${this.name}'s health is now ${this.health}!`);
        } 
    }

    // applies recover health from held item every round ends
    getRecoverHealth() {
        if (this.item) {
            this.health += 2;
            console.log(`${this.name} is healing from the blood drained! ${this.name}'s health is now ${this.health}!`);
        }
    }
}

// getHealth()) */

// module.exports = Character;