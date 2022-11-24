
class db{


    constructor(){
       
            this.mongoClient = require("mongodb").MongoClient
            this.link ="mongodb://localhost:27017"
            this.client = new this.mongoClient(this.link)
            this.db =  this.client.db("WK")
            this.collection = this.db.collection("events")

    }


}



module.exports = db