'use strict'

const debug = require('debug')('cListR')
const express = require('express')
const sanitizeMongo = require('express-mongo-sanitize')


require('./startup/database')()

const app = express()
app.use(express.json())
app.use(sanitizeMongo())
app.use('/api/students', require('./routes/students'))
app.use('/api/courses', require('./routes/courses'))

const port = process.env.PORT || 3030
app.listen(port, () => console.log(`Server listening on port ${port} ...`))
