const dotenv = require("dotenv");
dotenv.config();
const { mongoose } = require("./db");
const userRoutes = require("./routes/v1/user/route");
const taskRoutes = require("./routes/v1/task/route");
const express = require("express");

const app = express();
app.use(express.json());
app.use("/v1/user",userRoutes);
app.use("/v1/task",taskRoutes);

app.listen(process.env.PORT || 4000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Server connected");
    }
});

app.get("/", (req,res)=>{
    res.send("Hello this is jinendra");
});



