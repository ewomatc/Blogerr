require('dotenv').config()
const express = require('express')
const createError = require('http-errors')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const errorHandler = require('./middleware/error-handler')
require('./config/db-config')
const PORT = process.env.PORT 
const userRouter = require('./routes/user-router')
const postRouter = require('./routes/post-router')

const app = express()

// middlewares
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))
app.use(cors())




//load all routes/endpoints
app.use('/users', userRouter)
app.use('/posts', postRouter)




// Handle 404 Not Found errors
app.use( async (req, res, next) => {
	next(createError.NotFound('Resource not found'))
})

//error handler
app.use(errorHandler)



app.listen(PORT, () => {
	console.log(`server started on port ${PORT}`)
})