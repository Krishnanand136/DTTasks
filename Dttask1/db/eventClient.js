
class db{


    constructor(){
       
            this.mongoClient = require("mongodb").MongoClient
            this.link ="mongodb+srv://krishna:<password>@krishnascluster.ku7lbyi.mongodb.net/test"
            this.client = new this.mongoClient(this.link)
            this.db =  this.client.db("DTDB")
            this.collection = this.db.collection("events")

    }


}



module.exports = db