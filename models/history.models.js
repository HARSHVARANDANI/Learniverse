import mongoose from "mongoose"

const historySchema = new mongoose.Schema({
    topic: {
        type: String,
    },
    data: {
        type: Schema.Types.Mixed,
    }
})

export const History = mongoose.model("History", historySchema)