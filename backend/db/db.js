import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.DB_STRING)
        console.log(`\nMongoDB connected succesfully at DB host = ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log(`\nMongoDB connection failed\n`, error)
        process.exit(1)
    }
}

export default connectDB