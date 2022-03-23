const { MongoClient, ObjectId } = require("mongodb");

let databaseName = 'myGame';
let connectionString = 'mongodb://localhost:27017'

// getDb (returns a connection to a specific database on Mongodb)
const getDb = async() => {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db(databaseName);
    return db;
}

// getCollection (allows you to access a specific collection from a database)
const getCollection = async (name) => {
    let db = await getDb();
    let collection = db.collection(name)
    return collection;
}

//Created Player database and adds name, lives, role
const createPlayer = async (newPersonData) => {
    let collection = await getCollection('player')
    let result = await collection.insertOne(newPersonData)
    // console.log(result)
    return result
}

//Create NPC
const createNPC = async (NPCData) => {
    let NPCcollection = await getCollection('NPC')
    let NPCresult = await NPCcollection.insertOne(NPCData)
    // console.log(result)
    return NPCresult
}

// Provide name, Searches the collection and returns an object
const findPlayerByName = async (name) => {
    let playerCollection = await getCollection('player')
    let player = await playerCollection.findOne({name: name })
    console.log('name is: ', player)
    return player
}

// Provide ID searches 'player' db by ID to return an object
const findPlayerById = async (id) => {
    let playerCollection = await getCollection('player')
    let player = await playerCollection.findOne({ _id: ObjectId(id) })
    // console.log('player is: ', player)
    return player
}

// Prove ID searches 'NPC' db by ID to return an object

const findNPCById = async (id) => {
    let NPCCollection = await getCollection('NPC')
    let NPC = await NPCCollection.findOne({ _id: ObjectId(id) })
    // console.log('player is: ', player)
    return NPC
}

// updatePersonById
const updatePersonById = async (id, newPersonData) => {
    let playerCollection = await getCollection('player')
    let updated = await playerCollection.updateOne({_id: ObjectId(id)}, {$set: newPersonData})
    // console.log('updated is:' , updated)
    return updated
}

// updateNPCById
const updateNPCById = async (id, newPersonData) => {
    let NPCCollection = await getCollection('NPC')
    let updated = await NPCCollection.updateOne({_id: ObjectId(id)}, {$set: newPersonData})
    // console.log('updated is:' , updated)
    return updated
}

module.exports = {getDb, getCollection, createPlayer, findPlayerById, findPlayerByName, updatePersonById, createNPC, findNPCById, updateNPCById};
