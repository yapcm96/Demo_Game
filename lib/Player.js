// const Potion = require('../lib/Potion');
// const Character = require('./Character');
import {Potion} from '../lib/Potion.js'
import {Character} from '../lib/Character.js'

export class Player extends Character {
    constructor(name = '') {
        // Call parent constructor here:
        super(name);
// Superclass -> example of inheritance (prototype based OOP)
        this.inventory = [new Potion('health'), new Potion()];

    }

    getStats() {
        return {
            potions: this.inventory.length,
            health: this.health,
            strength: this.strength,
            agility: this.agility
        };
    }

    getInventory() {
        if (this.inventory.length) {
            return this.inventory
        }
        return false;
    }

    addRevive(potion) {
        this.inventory.push(potion);
    }

    useRevive(index) {
        const potion = this.inventory.splice(index, 1)[0];
// ['1','strength']
// splice --> ['strength']
// [0] ---> 'strength'
        switch (potion.name) {
            case 'agility':
                this.agility += potion.value;
                break;
            case 'health':
                this.health += potion.value;
                break;
            case 'strength':
                this.strength += potion.value;
                break;
        }
    }
}

// module.exports = Player;