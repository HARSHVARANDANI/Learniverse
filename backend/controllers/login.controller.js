import History from "../models/history.models.js";
import User from "../models/user.models.js";

export const handleLogin = async (req, res) => {
    const { email, name } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            const newUser = new User({ email, name });
            await newUser.save();
            user = newUser;
            console.log(newUser);
            
        }
        else {
            console.log("user found");
            console.log(user)
            try {const history = await History.find({ user: user._id });
            const topics = history.map((item) => item.topic);
            console.log(topics);
            res.status(200).json({ message: "User logged in successfully", topics });}
            catch (error) {
                console.log("No History found for user id: ", user._id);
                console.log(error);
                res.status(200).json({ message: "User logged in successfully", topics: [] });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Error: " + error });
    }
}

export default handleLogin;