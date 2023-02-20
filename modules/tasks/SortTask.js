const { default: mongoose } = require("mongoose");
const { Task } = require("../../models/TaskModel");

module.exports.sortTask = async (req, res) => {
    if (!req.body.tasks) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Invalid Tasks."
        });
    }
    let tasks = req.body.tasks;
    let updateData = tasks.map((element,index)=>{
        return { updateOne: {
            filter: { _id: mongoose.Types.ObjectId(element),isActive:true },
            update: { $set: { order: index+1 } }
         } 
        };
    });
    let task = await Task.bulkWrite(updateData);
    if (task) {
        return res.status(200).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: true,
            message: "Tasks sorted successfully.",
            data: task
        });
    } else {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Failed to sort tasks."
        });
    }
}