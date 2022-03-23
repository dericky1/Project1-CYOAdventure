const { findPlayerById, createPlayer, updatePersonById, createNPC, findNPCById, updateNPCById, createItem, findItemById } = require("./mongoDb");

let gameState = {
    name: '',
    lives: 0,
    role: '',
    HP: 100,
    DMG: 9,

}

let golemState = {
    name:'Golem',
    HP: 10
}

let equipmentState = {
        name: 'Dagger',
        DMG: 10
}

// Choose Class
function chooseClass(role) {
    if((role === 'Warrior') || ( role === "warrior")){
        let chosenClass = ({message:'You are a Warrior. Go to "http://localhost:5000/dungeonEntrance" to continue.', role: 'Warrior'})
        // console.log(chosenClass);
        updatePersonById(gameState._id, {role: chosenClass.role});
        // console.log(gameState._id)
        return chosenClass.message
    } else if ((role === 'Mage') || (role === 'mage')) {
        let chosenClass = ({message: 'You are a Mage. Go to "http://localhost:5000/dungeonEntrance" to continue.', role: 'Mage'})
        updatePersonById(gameState._id, {role: chosenClass.role});
        // console.log(gameState._id)
        return chosenClass.message
    } else {
        return({message:'You did not choose a proper class please pick again.', role: ''})
    }
}

function randomDice (){
    return Math.floor(Math.random()*9)
}

function golemCombatRoll(lifeCount) {
    let roll = randomDice();
    if (roll >= 3 ) { 
        message = 'You have defeated the Golem move to the next stage at: ----------'
        return message
    }
    else {
        message = 'You have died and lost a life retry at: ----------'
        updatePersonById(gameState._id, {lives: lifeCount - 1})
        return message
    }
}

// Golem

const attack = async (golemStateId,gameStateId) => {
    gameState = await findPlayerById(gameStateId);
    golemState = await findNPCById(golemStateId);
    await updateNPCById(golemState._id, {HP: golemState.HP - gameState.DMG})
    golemState = await findNPCById(golemStateId);
    // console.log('golemState is: ', golemState)
    if (golemState.HP <= 0){
        message = (`You have defeated the golem! Go to "http://localhost:5000/Golem/reward" to claim your reward!`)
        return ({message: message, golemState: golemState})
    } else {
        message = (`You have attacked the golem and did ${gameState.DMG} damage, it has ${golemState.HP} HP left! Visit the endpoint again to attack the Golem again!`)
        return ({message: message, golemState: golemState})
    }
}

// Load previous game
const loadGameState = async (id) => {
    let loadedGameState = await findPlayerById(id);
    // console.log(loadedGameState)
    gameState = loadedGameState;
    // console.log('gameState is: ' , gameState);
    return gameState
};

// Create new game
const createGameState = async (name) => {
    let newGameState = await createPlayer({
        name: name,
        lives: 3,
        role: '',
        HP: 100,
        DMG: 9
    });
    let newGameId = newGameState.insertedId;
    let game = await findPlayerById(newGameId);
    gameState = game;
    // console.log('gameState is: ', gameState)
    return gameState
}

// Create NPC
const createGolem = async (name) => {
    let newNPCState = await createNPC({
        name: name,
        HP: 10
    });
    let newNPCId = newNPCState.insertedId;
    let golem = await findNPCById(newNPCId);
    golemState = golem;
    return golemState
}

// Create Equipment
const createEquipment = async (name) => {
    let newItemState = await createItem({
        name: name,
        HP: 10,
        DMG: 10
    });
    let newItemId = newItemState.insertedId;
    let item = await findItemById(newItemId);
    itemState = item;
    return itemState
}

module.exports = {chooseClass, randomDice, golemCombatRoll, loadGameState, createGameState, createGolem, createEquipment, attack}
