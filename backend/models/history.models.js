import mongoose from "mongoose"

const historySchema = new mongoose.Schema({
    topic: {
        type: String,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    searchedAt: {
        type: Date,
        default: Date.now,
    },
})

const History = mongoose.model("History", historySchema)

export default History