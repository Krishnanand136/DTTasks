class dto{

    constructor(id , type , uid , ename, file, tagline, schedule, description, moderator, category){
        this._id = id
        if(type != undefined) {
            this.type = type
        }
        if(uid != undefined) {
            this.uid = uid
        }
        if(ename != undefined) {
            this.ename = ename
        }
        if(file != undefined) {
            this.file = file.filename
        }
        if(tagline != undefined) {
            this.tagline = tagline
        }
        if(schedule != undefined) {
            this.schedule = schedule
        }
        if(description != undefined) {
            this.description = description
        }
        if(moderator != undefined) {
            this.moderator = moderator
        }
        if(category != undefined) {
            this.category = category
        }
       
    }

}

module.exports = dto