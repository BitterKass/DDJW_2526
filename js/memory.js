import {jQuery} from '../library/jquery-4.0.0.slim.module.min.js';
import {setValue, clickOn, clickOff} from './game.js';

const svgBase = 'data:image/svg+xml;utf8,';

const back = svgBase + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 128"><rect width="96" height="128" fill="black"/><rect x="6" y="6" width="84" height="116" fill="%230095ff"/></svg>';

const resources = [
    svgBase + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 128"><rect width="96" height="128" fill="white" stroke="black" stroke-width="12"/><circle cx="48" cy="64" r="30" fill="%230095ff" stroke="black" stroke-width="3"/></svg>',

    svgBase + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 128"><rect width="96" height="128" fill="white" stroke="black" stroke-width="12"/><circle cx="48" cy="64" r="30" fill="%23ff7b00" stroke="black" stroke-width="3"/></svg>',

    svgBase + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 128"><rect width="96" height="128" fill="white" stroke="black" stroke-width="12"/><rect x="22" y="38" width="52" height="52" fill="%230095ff" stroke="black" stroke-width="3"/></svg>',

    svgBase + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 128"><rect width="96" height="128" fill="white" stroke="black" stroke-width="12"/><rect x="22" y="38" width="52" height="52" fill="%23ff7b00" stroke="black" stroke-width="3"/></svg>',

    svgBase + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 128"><rect width="96" height="128" fill="white" stroke="black" stroke-width="12"/><polygon points="48,30 20,90 76,90" fill="%230095ff" stroke="black" stroke-width="3"/></svg>',

    svgBase + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 128"><rect width="96" height="128" fill="white" stroke="black" stroke-width="12"/><polygon points="48,30 20,90 76,90" fill="%23ff7b00" stroke="black" stroke-width="3"/></svg>'
];

const StateCard = Object.freeze({
    DISABLE: 0,
    ENABLE: 1,
    DONE: 2
});

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    flippedCards: [],
    gameMode: 1,
    level: 1,
    score: 200,
    groupsRemaining: 2,
    initialGroups: 2,
    groupSize: 2,
    penalty: 25,
    timeBase: 1000,
    timeStep: 10,

    goBack: function (idx) {
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function (idx) {
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    start: function () {
        this.items.forEach((_, indx) => {
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE) {
                this.ready++;
            } else {
                setTimeout(() => {
                    this.ready++;
                    this.goBack(indx);
                }, this.timeBase + this.timeStep * indx);
            }
        });
    },
    click: function (indx) {
        if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;
        this.goFront(indx);
        this.flippedCards.push(indx);

        if (this.flippedCards.length === this.groupSize) {
            let referenceCard = this.items[this.flippedCards[0]];
            let allMatch = this.flippedCards.every(id => this.items[id] === referenceCard); // CORREGIT

            if (allMatch) {
                this.groupsRemaining--;
                this.flippedCards.forEach(id => this.states[id] = StateCard.DONE);
                if (this.groupsRemaining <= 0) {
                    if (this.gameMode === 1) {
                        alert(`Has guanyat amb ${this.score} punts!!!!`);
                        window.location.assign("../");
                    } else {
                        alert(`Nivell ${this.level} completat! Puntuació: ${this.score}. Preparat pel següent?`);

                        this.level++;
                        let nextPairs = Math.min(10, this.initialGroups + 1);

                        let nextGroupSize = this.groupSize;
                        if (this.level % 3 === 0) nextGroupSize++;

                        let nextTimeBase = Math.max(200, this.timeBase - 200);
                        let nextPenalty = this.penalty + 10;

                        sessionStorage.load = JSON.stringify({
                            items: [],
                            gameMode: 2,
                            level: this.level,
                            score: this.score,
                            pairs: nextPairs,
                            groupSize: nextGroupSize,
                            penalty: nextPenalty,
                            timeBase: nextTimeBase,
                            timeStep: this.timeStep
                        });
                        window.location.reload();
                    }
                }
            } else {
                this.flippedCards.forEach(id => this.goBack(id));
                this.score -= this.penalty;
                if (this.score <= 0) {
                    alert("Has perdut");
                    window.location.assign("../");
                }
            }

            this.flippedCards = [];
        }
    },
    select: function () {
        let toLoad = sessionStorage.load ? JSON.parse(sessionStorage.load) : null;

        if (toLoad && toLoad.items && toLoad.items.length > 0) {
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.flippedCards = toLoad.flippedCards || [];
            this.score = toLoad.score;
            this.groupsRemaining = toLoad.pairs;
            this.groupSize = toLoad.groupSize;
            this.gameMode = toLoad.gameMode;
            this.level = toLoad.level;
            this.penalty = toLoad.penalty;
            this.timeBase = toLoad.timeBase;

            sessionStorage.removeItem('load');
        } else {
            if (toLoad && toLoad.gameMode === 2) {
                // Carreguem la configuració del NOU NIVELL Mode 2
                this.gameMode = 2;
                this.level = toLoad.level;
                this.score = toLoad.score;
                this.initialGroups = toLoad.pairs;
                this.groupSize = toLoad.groupSize;
                this.penalty = toLoad.penalty;
                this.timeBase = toLoad.timeBase;
                this.timeStep = toLoad.timeStep;
                sessionStorage.removeItem('load');
            } else {
                this.gameMode = parseInt(sessionStorage.getItem('gameMode')) || 1;
                this.level = 1;
                this.score = 200;
                this.flippedCards = [];

                if (this.gameMode === 1) {
                    let savedOptions = localStorage.options ? JSON.parse(localStorage.options) : {
                        pairs: 2,
                        groupSize: 2,
                        difficulty: 'normal'
                    };
                    this.initialGroups = parseInt(savedOptions.pairs) || 2;
                    this.groupSize = parseInt(savedOptions.groupSize) || 2;

                    if (savedOptions.difficulty === 'hard') {
                        this.groupSize++;
                        this.penalty = 50;
                        this.timeBase = 500;
                    } else if (savedOptions.difficulty === 'easy') {
                        this.groupSize = Math.max(2, this.groupSize - 1);
                        this.penalty = 10;
                        this.timeBase = 1500;
                    } else {
                        this.penalty = 25;
                        this.timeBase = 1000;
                    }
                } else {
                    this.initialGroups = 2;
                    this.groupSize = 2;
                    this.penalty = 15;
                    this.timeBase = 1500;
                }
            }
            this.groupsRemaining = this.initialGroups;

            this.items = resources.slice();
            shuffe(this.items);
            let selectedCards = [];
            for (let i = 0; i < this.groupsRemaining; i++) {
                selectedCards.push(this.items[i % this.items.length]);
            }
            this.items = [];
            for (let i = 0; i < this.groupSize; i++) {
                this.items = this.items.concat(selectedCards);
            }
            shuffe(this.items);
            this.states = new Array(this.items.length).fill(StateCard.ENABLE);
        }
    },
    save: function () {
        let gameSave = {
            date: new Date().toLocaleString(),
            items: this.items,
            states: this.states,
            flippedCards: this.flippedCards,
            score: this.score,
            pairs: this.groupsRemaining,
            groupSize: this.groupSize,
            gameMode: this.gameMode,
            level: this.level,
            penalty: this.penalty,
            timeBase: this.timeBase,
            timeStep: this.timeStep
        };

        let saves = JSON.parse(localStorage.getItem('memory_saves')) || [];
        saves.unshift(gameSave);

        if (saves.length > 5) {
            saves.pop();
        }
        localStorage.setItem('memory_saves', JSON.stringify(saves));
        alert("Partida guardada correctament!");
        window.location.assign("../");
    }
}

function shuffe(arr) {
    arr.sort(function () {
        return Math.random() - 0.5
    });
}

export var gameItems;

export function selectCards() {
    game.select();
    gameItems = game.items;
}

export function clickCard(indx) {
    game.click(indx);
}

export function startGame() {
    game.start();
}

export function initCard(callback) {
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback);
}

export function saveGame() {
    game.save();
}