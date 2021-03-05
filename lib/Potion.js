
export class Potion {
    constructor(name) {
        this.types = ['strength', 'agility', 'health','super-health'];
        this.name = name || this.types[Math.floor(Math.random() * this.types.length)];

        if (this.name === 'health') {
            this.value = Math.floor(Math.random() * 15 + 30);
        } else if (this.name === 'super-health') {
            this.value = Math.floor(Math.random() * 15 + 50);
        } else {
            this.value = Math.floor(Math.random() * 15 + 7);
        }
    }
}

// module.exports = Potion;


