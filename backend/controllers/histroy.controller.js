import History from "../models/history.models.js";

const getHistory = async (req, res) => {
    const { user, topic } = req.body;
    const history = await History.find({ user: user._id, topic });
    res.json(history.data);
}

export default getHistory;