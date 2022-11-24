const express = require('express')
const { ObjectId, Int32  } = require('mongodb')
const multer = require('multer')
const eventDto = require('../../../../dto/eventDto')
const eventDao = require('../../../../dao/eventDao')
const db = require("../../../../db/eventClient")
const router = express.Router()
const {readFileSync} = require('fs')
const {join} = require('path')
/*eDao = new eventDao()
eDao.deleteAll()*/



//file upload multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, join(__dirname , 'images'))
    },
    filename: function (req, file, cb) {
      fileName = Date.now() + '_' + Math.round(Math.random() * 1E9) + "." + file.originalname.split(".")[1]
      fileUploaded = true
      cb(null, file.fieldname + '-' + fileName)
    }
  })
const upload = multer({ storage: storage })



router.use(express.json());
// router.use(express.urlencoded()); 




router.get("/userCreated/:uid",async(req,res)=>{
  
  responseObject  = {
    error_code : 0,
    message : "",
    success : "",
    data : "",
  }
  

    try{
        userId = new ObjectId(req.params.uid)
        eDao = new eventDao()
        result = await eDao.getAllEventByUserId(userId)
        if(result == null){
            responseObject.success = false,
            responseObject.message = "No such records found"
            responseObject.data = {}
        }
        else{
          responseObject.success = true,
          responseObject.message = "record found" 
          responseObject.data = result
        }

        res.status(200).send(responseObject)

    }catch(e){
      if(e.name == "BSONTypeError"){ 
        responseObject.error_code = 1 , 
        responseObject.success = false,
        responseObject.message = "Id parameter is not of BSONType"
        responseObject.data = {}
        res.status(200).send(responseObject)

      }else{ 
        responseObject.error_code = 500, 
        responseObject.success = false,
        responseObject.message = "some error occured"
        responseObject.data = e
        res.status(500).send(responseObject)
      }
    }
    
})

router.get("/userCreated/image/:eid" , async(req , res)=>{
      
  responseObject  = {
    error_code : 0,
    message : "",
    success : "",
    data : "",
  }
  

    try{
        eventId = new ObjectId(req.params.eid)
        eDao = new eventDao()
        result = await eDao.getEventById(eventId)
        if(result == null){
            responseObject.success = false,
            responseObject.message = "No such records found"
            responseObject.data = {}
            res.status(200).send(responseObject)
        }
        else{ 
          if(result.file != undefined){
            res.status(200).sendFile(join(__dirname, "images" , result.file))
          }
          else{
            responseObject.success = true,
            responseObject.message = "No image"
            responseObject.data = {}
            res.status(200).send(responseObject)
          }

         
        }


    }catch(e){
      if(e.name == "BSONTypeError"){ 
        responseObject.error_code = 1 , 
        responseObject.success = false,
        responseObject.message = "Id parameter is not of BSONType"
        responseObject.data = {}
        res.status(200).send(responseObject)

      }else{ 
        responseObject.error_code = 500, 
        responseObject.success = false,
        responseObject.message = "some error occured"
        responseObject.data = e
        res.status(500).send(responseObject)
      }
    }
})

router.get("", async (req,res)=>{

    responseObject  = {
      error_code : 0,
      message : "",
      success : "",
      data : "",
    }
    
    if(req.query.id != undefined){

      try{
          eventId = new ObjectId(req.query.id)
          eDao = new eventDao()
          result = await eDao.getEventById(eventId)
          if(result == null){
              responseObject.success = false,
              responseObject.message = "No such records found"
              responseObject.data = {}
          }
          else{
            responseObject.success = true,
            responseObject.message = "record found" 
            responseObject.data = result
          }

          res.status(200).send(responseObject)

      }catch(e){
        if(e.name == "BSONTypeError"){ 
          responseObject.error_code = 1 , 
          responseObject.success = false,
          responseObject.message = "Id parameter is not of BSONType"
          responseObject.data = {}
        }else{ 
          responseObject.error_code = 500, 
          responseObject.success = false,
          responseObject.message = "some error occured"
          responseObject.data = e
          throw e;
        }
        res.status(500).send(responseObject)
      }

      

    }else{

      type = req.query.type || "event"
      page = parseInt(req.query.page) || 0
      limit = parseInt(req.query.limit) || null


      eDao = new eventDao()
      result = await eDao.getEventByPage(type , page , limit)
      responseObject.success = true,
      responseObject.message = "no of record(s) found : " + result.length 
      responseObject.data = result
      
      res.status(200).send(responseObject)
    }

})

router.post("/" ,  upload.single('eventImage'),async (req , res)=>{
        responseObject  = {
          error_code : 0,
          message : "",
          success : "",
          data : "",
        }

        eventId = new ObjectId()
        eDto = new eventDto(eventId , "event" , ObjectId(req.body.uid) , req.body.name , req.file , req.body.tagline, new Date(req.body.schedule) , req.body.description, req.body.moderator , req.body.category )
        eDao = new eventDao()
        try{
          await eDao.insertOneEvent(eDto)
          responseObject.success = true,
          responseObject.error_code = 0 , 
          responseObject.message = "Inserted one record"
          responseObject.data = {eventId}
          res.status(200).send(responseObject)
        }catch(e){
          responseObject.success = false,
          responseObject.message = "some error occured"
          responseObject.data = e
          responseObject.error_code = 500 ,
          res.status(500).send(responseObject)

        }

        
})

router.put("/:id" ,  upload.single('eventImage'), async (req , res)=>{
  eDao = new eventDao()
  responseObject  = {
    error_code : 0,
    message : "",
    success : "",
    data : "",
  }

  try{
      eventId = ObjectId(req.params.id)
      eDto = new eventDto( eventId , "event" , ObjectId(req.body.uid) , req.body.name , req.file , req.body.tagline, req.body.schedule , req.body.description, req.body.moderator , req.body.category , req.body.sub_category , req.body.rigor_rank , req.body.attendees)
      eDao = new eventDao()
      result = await eDao.updateEventById(eventId , eDto)

      if(result.modifiedCount == 0 && result.upsertedCount == 0){
        responseObject.success = false,
        responseObject.message = "No such records to update" 
        responseObject.data = {}
      }else{
        responseObject.success = true,
        responseObject.message = "Updated record with id : '" + req.params.id + "'"
        responseObject.data = {}
      }
      res.status(200).send(responseObject)

    }catch(e){
      
      if(e.name == "BSONTypeError"){ 
        responseObject.error_code = 1 , 
        responseObject.success = false,
        responseObject.message = "Id parameter is not of BSONType"
        responseObject.data = {}
      }else{ 
        responseObject.error_code = 500, 
        responseObject.success = false,
        responseObject.message = "some error occured"
        responseObject.data = e
      }
      res.status(500).send(responseObject)
      
    } 


})

router.delete("/:id" , async (req , res)=>{
  responseObject  = {
    error_code : 0,
    message : "",
    success : "",
    data : "",
  }
  eDao = new eventDao()
  try{

      eventId = new ObjectId(req.params.id)//gives error if id not of BSONType
      count = await eDao.deleteEventbyId(eventId)

      if(count == 0){
        responseObject.success = false,
        responseObject.message = "No such records to delete"
        responseObject.data = {}
      }
      else{
        responseObject.success = true,
        responseObject.message = "Deleted record with ObjectId(" + req.params.id + ")"
        responseObject.data = {}
      }
      res.status(200).send(responseObject)

    }catch(e){
      if(e.name == "BSONTypeError"){ 
        responseObject.error_code = 1 , 
        responseObject.success = false,
        responseObject.message = "Id parameter is not of BSONType"
        responseObject.data = {}
      }else{ 
        responseObject.error_code = 500, 
        responseObject.success = false,
        responseObject.message = "some error occured"
        responseObject.data = e
      }
      res.status(500).send(responseObject)
    } 

})




module.exports = router
