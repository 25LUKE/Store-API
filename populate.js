require('dotenv').config();

const connectDB = require('./db/connect');
const Product = require('./models/product')
const jsonProducts = require('./products.json')

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_CONNECT)
        await Product.deleteMany();
        await Product.create(jsonProducts)
        console.log('Conected Successful!!!')
        process.exit(0);
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

start()