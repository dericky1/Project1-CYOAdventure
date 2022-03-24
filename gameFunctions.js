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

let npcState = {
}

let equipmentState = {
        name: 'Dagger',
        DMG: 10
}

let dragonState = {
    name:'Dragon',
    HP: 100,
    DMG: 15
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

// function golemCombatRoll(lifeCount) {
//     let roll = randomDice();
//     if (roll >= 3 ) { 
//         message = 'You have defeated the Golem move to the next stage at: ----------'
//         return message
//     }
//     else {
//         message = 'You have died and lost a life retry at: ----------'
//         updatePersonById(gameState._id, {lives: lifeCount - 1})
//         return message
//     }
// }

// Golem

const attack = async (npcStateId, gameStateId) => {
    gameState = await findPlayerById(gameStateId);
    npcState = await findNPCById(npcStateId);
    await updateNPCById(npcState._id, {HP: npcState.HP - gameState.DMG})
    npcState = await findNPCById(npcStateId);
    if (npcState.HP <= 0){
        message = (` You have defeated the ${npcState.name}! Go to "http://localhost:5000/${npcState.name}/reward" to claim your reward!`)
        return ({message: message, npcState: npcState})
    } else {
        message = (` You have attacked the ${npcState.name} and did ${gameState.DMG} damage, it has ${npcState.HP} HP left! Visit the endpoint again to attack the ${npcState.name} again!`)
        return ({message: message, npcState: npcState})
    }
}
const npcAttack = async(gameStateId, npcStateId) => {
    gameState = await findPlayerById(gameStateId);
    // console.log('npcAttack gameState is: ', gameState)
    npcState = await findNPCById(npcStateId);
    await updatePersonById(gameState._id, {HP: gameState.HP - npcState.DMG})
    gameState = await findPlayerById(gameStateId);
    if (gameState.HP <= 0){
        message = (`Oh dear you have died...`)
        return ({message: message, gameState: gameState})
    } else {
        message = (`The ${npcState.name} has attacked you and did ${npcState.DMG} damage, you have ${gameState.HP} HP left!`)
        return ({message: message, gameState: gameState})
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

// Create Golem
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

// Create Dragon
const createDragon = async (name) => {
    let newNPCState = await createNPC({
        name: name,
        HP: 100,
        DMG: 15
    });
    let newNPCId = newNPCState.insertedId;
    let dragon = await findNPCById(newNPCId);
    dragonState = dragon;
    return dragonState
}

// Create Equipment
const createEquipment = async (name, HP, DMG) => {
    let newItemState = await createItem({
        name: name,
        HP: HP,
        DMG: DMG
    });
    let newItemId = newItemState.insertedId;
    let item = await findItemById(newItemId);
    itemState = item;
    return itemState
}

module.exports = {chooseClass, randomDice, loadGameState, createGameState, createGolem, createEquipment, createDragon, attack, npcAttack}
