
const express = require('express')
const mainPage = express()
const appRoutes = require('./api/v3/app/events/events')
const cors = require('cors')

mainPage.use(cors())

mainPage.use('/api/v3/app/events' , appRoutes)

mainPage.listen(8000)