
export class Character {
    constructor(name = '') {
        this.name = name;
        this.health = Math.floor(Math.random() * 10 + 95);
        this.strength = Math.floor(Math.random() * 5 + 7);
        this.agility = Math.floor(Math.random() * 5 + 7);
        this.status = null;
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
                protection = 5;
                break;
            case 'Golem Armor':
                protection = 10;
                break;
        }
        // console.log(protection)
        // console.log(damage)
        if ((protection-damage) < 0) {
            this.health += (protection-damage);
        }

        if (this.item) {
            this.health += 100;
        }

        if (this.health < 0) {
            this.health = 0;
        }
    }

    // applies damage from poisoned status every round ends
    getPoisonedDamage() {
        if (this.status) {
            this.health -= Math.floor(Math.random() * 10);

            if (this.health < 0) {
                this.health = 0;
            }
        } 

    }


}

// getHealth()) */

// module.exports = Character;