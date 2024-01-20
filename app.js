require('dotenv').config()
require('express-async-errors')
const express = require('express')
const connectDB = require('./db/connect')
const notFoundMiddleware = require('./middleware/error-handler')
const errorMiddleware = require('./middleware/not-found')
const productsRouter = require('./routes/products')

const app = express();



//middleware
app.use(express.json());

// routes
app.use('/api/v1/products', productsRouter)
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})


//product route
app.use(notFoundMiddleware)
app.use(errorMiddleware )

const port = process.env.PORT

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_CONNECT)
        app.listen(port, console.log(`Server running on port ${port}...`))
    } catch (err) {
        console.log(err)
    }
}

start()