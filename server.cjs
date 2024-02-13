const express = require('express')
// Importing required functions from dbConnection.cjs
const bodyParser =require('body-parser')
const {ObjectId} = require('mongodb')
const {connectToDb, getDb} = require('./dbconnection.cjs')

const app = express()
app.use(bodyParser.json())

let db
connectToDb(function(error) {
    if(error) {
        console.log('Could not establish connection...')
        console.log(error)
    } else {
        const port = process.env.PORT || 6000
        app.listen(port)
        db = getDb()
        console.log(`Listening on port 6000 ${port}`)
    }
})
app.post('/add-entry', function(request, response) {
    db.collection('expenses').insertOne(request.body).then(function() {
        response.status(201).json({
            "status" : "Entry added successfully"
        })
    }).catch( function () {
        response.status(500).json({
            "status" : "Entry not added"
        })
    })
})


app.get('/get-entries', function(request, response) {
    // Declaring an empty array
    const entries = []
    db.collection('expenses')
    .find()
    .forEach(entry => entries.push(entry))
    .then(function() {
        response.status(200).json(entries)
    }).catch(function() {
        response.status(404).json({
            "status" : "Could not fetch documents"
        })
    })
})// to enter new data in new object//

app.delete('/delete-entry', function(request, response) {
    if(ObjectId.isValid(request.query.id)) {
        db.collection('expenses').deleteOne({
            _id : new ObjectId(request.query.id)
        }).then(function() {
            response.status(200).json({
                "status" : "Entry successfully deleted"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Entry not deleted"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})// to delete the entire object//

app.patch('/update-entry/:id', function(request, response) {
    if(ObjectId.isValid(request.params.id)) {
        db.collection('expenses').updateOne(
            { _id : new ObjectId(request.params.id) }, // identifier : selecting the document which we are going to update
            { $set : request.body } // The data to be updated
        ).then(function() {
            response.status(200).json({
                "status" : "Entry updated successfully"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Unsuccessful on updating the entry"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})