import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import authRoutes from "../routes/authRoutes.js";


const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello World! 1234');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
