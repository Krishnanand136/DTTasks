
const express = require('express')
const mainPage = express()
const appRoutes = require('./api/v3/app/events/events')


mainPage.use('/api/v3/app/events' , appRoutes)

mainPage.listen(8000)