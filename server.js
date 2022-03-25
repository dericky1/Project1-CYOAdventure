const express = require('express');
const app = express();
const {randomDice, chooseClass, loadGameState, newGameId, createGameState, createGolem, createEquipment, createDragon, attack, npcAttack, handleCombat} = require('./gameFunctions')
const {updatePersonById, findPlayerById, findPlayerByName, getDb, getCollection, createPlayer, createNPC, createItem} = require('./mongoDb');
// const mongoose = require('mongoose');

// Listen
app.listen(5000, () => {console.log('server is listening on port 3000...')})

// Database
// mongoose.connect('', {useNewParser: true})
//     .then(() => console.log('Connected to databate...'))
//     .catch(err => console.err(err));

// Routes

app.get('/', (req,res) => {
    res.send('You are camped outside of the dungeon please go to: "http://localhost:5000/startGame?name=${name}" to set your class and start your adventure! or go to http://localhost:5000/loadGame?gameId={id} to load a previous game')
});

app.get('/loadGame', async (req,res) => {
    let gameId = req.query.gameId;
    let gameState = await loadGameState(gameId);
    // console.log('gameState is: ', gameState)
    res.send(`You have loaded your previous game. Welcome back ${gameState.name}!...to continue...`)
});

app.get('/startGame', async (req, res) => {
    let name = req.query.name;
    gameState = await createGameState(name);
    // console.log('gameState is: ', gameState);
    //  console.log('gameId is: ', gameId);
    res.send('Set your role to Warrior or Mage. Go to "http://localhost:5000/chooseClass?role=${role}" and enter a query to choose your class.')
});

app.get('/chooseClass', async (req, res) => {
    let role = req.query.role;
    let message = chooseClass(role);
    gameState = await findPlayerById(gameState._id);
    // console.log('gameState is: ', gameState)
    res.send(message)
});

app.get('/dungeonEntrance', (req, res) => {
    res.send('You have entered a dungeon and see a Golem! Approach the golem at "http://localhost:5000/Golem".')
});

app.get('/Golem', async (req, res) => { 
    golemState = await createGolem('Golem')
    gameState = await findPlayerById(gameState._id);
    // console.log('gameState is: ', gameState)
    // console.log(golemState)
    res.send('The Golem has spawned! Go to curl http://localhost:5000/Golem/combat to attack it')
});

app.get('/Golem/reward', async (req,res) => {
    equipmentState = await createEquipment('Dagger', 10, 10);
    // console.log('equipmentState: ', equipmentState)
    // console.log('equipmentState.DMG is: ', equipmentState.DMG)
    await updatePersonById(gameState._id, {DMG: gameState.DMG + equipmentState.DMG, HP: gameState.HP + equipmentState.HP})
    gameState = await findPlayerById(gameState._id);
    // console.log('gameState is: ', gameState)
    res.send('You received a dagger and your damage and hp has been increased by 10! As you are walking around in the dungeon you spot a treasure chest in the distance. Go to "curl http://localhost:5000/TreasureChest" to check it out')
});

app.get('/Golem/attack', async (req, res) => { 
    // console.log(golemState);
    attackFunction = await attack(golemState._id,gameState._id);
    golemState = attackFunction.golemState;
    // console.log('gameState is: ', gameState)
    res.send(attackFunction.message)
});

app.get('/TreasureChest', async (req, res) => {
    //function that creates a dragon in NPC
    dragonState = await createDragon('Dragon')
    //function that does dmg to you (takes in the id for the thing that attacks you)
    npcAttackFunction = await npcAttack(gameState._id, dragonState._id)
    gameState = npcAttackFunction.gameState;
    // console.log('gameState is: ', gameState)
    res.send('You try to open the treasure chest but suddenly the ground starts shaking. A dragon shoots a fireball at you and has did 15 DMG! Defend yourself at "curl http://localhost:5000/Dragon/combat"')
});

app.get('/Dragon/combat', async (req, res) => {
    console.log(gameState)
    console.log(dragonState)
    combat = await handleCombat(gameState._id, dragonState._id)
    // attackFunction = await attack(dragonState._id, gameState._id) // me attacking dragon
    // // console.log('attackFunction is: ', attackFunction)
    // npcAttackFunction = await npcAttack(gameState._id, dragonState._id) // dragon attacking me
    // console.log('npcAttackFunction is: ', npcAttackFunction)
    // res.send(npcAttackFunction.message + attackFunction.message)
    res.send(combat)
});

app.get('/Dragon/reward', async (req, res) => {
    // create Armour drop
    equipmentState = await createEquipment('Armour', 100, 5);
    // update character stats
    await updatePersonById(gameState._id, {DMG: gameState.DMG + equipmentState.DMG, HP: gameState.HP + equipmentState.HP})
    res.send('You open the treasure chest and find some armour! It has increased your health points by 100 and damage by 5')
});


app.get('/Home', (req, res) => {
    res.send('You have returned Home! Here are your stats:')
});

