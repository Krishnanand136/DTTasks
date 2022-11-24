const { MongoAPIError } = require('mongodb')


class dao{

    async deleteAll(){
        let dba = require('../db/eventClient')
        let tempConn = new dba()
        await tempConn.collection.deleteMany()
        tempConn.client.close()
    }
    async insertOneEvent(eventDto){
        let dba = require('../db/eventClient')
        let tempConn = new dba()
        await tempConn.collection.insertOne(eventDto)
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
            await tempConn.collection.deleteOne({"_id":eventId})
            tempConn.client.close()
        
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
    async getEventByPage(type , page = null , limit = null){
        let dba = require('../db/eventClient')
        let tempConn = new dba()
        let event = []
        if(page == null || limit == null){
            let result = await tempConn.collection.find({"type" : type})
            .sort({"schedule":1})
            .forEach(doc => event.push(doc))
        }else{
            let result = await tempConn.collection.find({"type" : type})
            .sort({"schedule":1})
            .skip(page*limit)
            .limit(limit)
            .forEach(doc => event.push(doc))
        }
        
        return event
      
        
    }
    async getAllEventByUserId(uid){
        let dba = require('../db/eventClient')
        let tempConn = new dba()
        let result = tempConn.collection.find({"uid" : uid})
        let returnRes = []
        await result.forEach((ele)=>returnRes.push(ele));
        tempConn.client.close()
        return returnRes
    }
    
}




module.exports = dao
