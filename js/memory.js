import { jQuery } from '../library/jquery-4.0.0.slim.module.min.js';
import {setValue, clickOn, clickOff} from './game.js';
const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

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
    score: 200,
    groupsRemaining: 2,
    groupSize: 2,
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    select: function(){
        if (sessionStorage.load){ // Carreguem partida
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.flippedCards = toLoad.flippedCards || []; // CORREGIT
            this.score = toLoad.score;
            this.groupsRemaining = toLoad.pairs;
            this.groupSize = toLoad.groupSize || 2;
        }
        else{ // Nova partida
            let savedOptions = localStorage.options ? JSON.parse(localStorage.options) : {pairs: 2, groupSize: 2};
            this.groupsRemaining = parseInt(savedOptions.pairs) || 2;
            this.groupSize = parseInt(savedOptions.groupSize) || 2;
            this.flippedCards = []; // CORREGIT

            this.items = resources.slice();
            shuffe(this.items);

            let selectedCards = this.items.slice(0, this.groupsRemaining);

            this.items = [];
            for(let i = 0; i < this.groupSize; i++) {
                this.items = this.items.concat(selectedCards);
            }

            shuffe(this.items);
            this.states = new Array(this.items.length).fill(StateCard.ENABLE);
        }
    },
    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE){
                this.ready++;
            }
            else{
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx);
            }
        });
    },
    click: function(indx){
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
                    alert(`Has guanyat amb ${this.score} punts!!!!`);
                    window.location.assign("../");
                }
            } else {
                this.flippedCards.forEach(id => this.goBack(id));
                this.score -= 25;
                if (this.score <= 0){
                    alert ("Has perdut");
                    window.location.assign("../");
                }
            }

            this.flippedCards = [];
        }
    },
    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            flippedCards: this.flippedCards,
            score: this.score,
            pairs: this.groupsRemaining,
            groupSize: this.groupSize
        });

        let ret = false;
        fetch('../php/save.php', {
            method: "POST",
            body: to_save,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
            .then(response => ret = JSON.parse(response))
            .catch (err => console.error(err));

        if (!ret) {
            console.warn("La partida s'ha guardat en local.");
            localStorage.save = to_save;
        }
        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}

export var gameItems;
export function selectCards() {
    game.select();
    gameItems = game.items;
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) {
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback);
}
export function saveGame(){
    game.save();
}