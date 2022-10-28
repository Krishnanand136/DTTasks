

class dao{

    insertOneEvent(eventDto){
        let dba = require('../db/eventClient')
        let tempConn = new dba()
        tempConn.collection.insertOne(eventDto)
        tempConn.client.close()
    }
    async deleteEventbyId(eventId){
        let dba = require('../db/eventClient')
        let unlink = require('fs').unlink
        let join = require('path').join
        let tempConn = new dba()

        // get document image path to delete image
        let result = await tempConn.collection.findOne({"_id":eventId})
        
        let deletedCount = 0

        if(result != null){
            deletedCount = 1
            tempConn.collection.deleteOne({"_id":eventId}).then((doc)=>{
                tempConn.client.close()
            })
            if(result.file != undefined){
                unlink(join(__dirname , ".." , "api" , "v3" , "app" , "events" , "images" , result.file) , ()=>{})
            }

        }
        
        return deletedCount

        
        

    }
    async updateEventById(eventId , eventDto){
        let dba = require('../db/eventClient')
        let tempConn = new dba()
        delete eventDto._id
        let result = await tempConn.collection.updateOne( {"_id" : eventId} ,{ "$set":eventDto} , {"upsert" : false})
        tempConn.client.close()
        return result;
    }
    async getEventById(eventId){
        let dba = require('../db/eventClient')
        let tempConn = new dba()
        let result = await tempConn.collection.findOne({"_id" : eventId})
        tempConn.client.close()
        return result
    }
    async getEventByPage(type , page , limit){
        let dba = require('../db/eventClient')
        let tempConn = new dba()
        let event = []
        let result = await tempConn.collection.find({"type" : type})
        .sort({"schedule":1})
        .skip(page*limit)
        .limit(limit)
        .forEach(doc => event.push(doc))
        return event
      
        
    }
}




module.exports = dao
