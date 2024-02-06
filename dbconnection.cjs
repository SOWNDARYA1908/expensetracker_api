const {MongoClient} = require('mongodb')

let dbConnection
function connectToDb(callBack) {
    MongoClient.connect('mongodb+srv://sowndaryas:uzumakisow19@cluster0.l97rmpq.mongodb.net/expensedb?retryWrites=true&w=majority').then(function(client) {
        dbConnection = client.db()
        callBack()
    }).catch(function(error) {
        callBack(error)
    })
}

function getDb() {
    return dbConnection
}

// Exporting required functions
module.exports = {connectToDb, getDb}