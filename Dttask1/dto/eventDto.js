class dto{

    constructor(id , type , uid , ename, file, tagline, schedule, description, moderator, category, sub_category, rigor_rank , attendees){
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
        if(sub_category != undefined) {
            this.sub_category = sub_category
        }
        if(rigor_rank != undefined) {
            this.rigor_rank = rigor_rank
        }
        if(attendees != undefined) {
            this.attendees = attendees
        }
    }

}

module.exports = dto