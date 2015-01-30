/*
 * risdd.js is an restfull api to throw json querys aginst the Dresden-RIS
 * and get back all found objects as json
 *
 * usage:
 * require('risdd.js')
 * risdd = new RISDD();
 * risdd.query({ search : 'needle' }, function(data){
 *      console.dir(data);
 * }));
 * 
 */


// ---
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

this.query = function(queryJSON, callback) {

    mongodbsearch(  queryJSON['search'],
                    queryJSON['collection'],
                    queryJSON['key'], function(docs){
        if( docs.length > 0)  callback(docs);
        else callback({ result : false })
    });
}


// ---
var mongodbsearch = function(str, collectionName, keyName, callback) {
    var url = 'mongodb://localhost:27017/ris';
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        var collection = db.collection( collectionName );

        var query = { };
        query[ keyName ] = new RegExp(str);
        collection.find( query ).toArray(function(err,docs) {
            db.close();        
            callback(docs);
        });
    });
}