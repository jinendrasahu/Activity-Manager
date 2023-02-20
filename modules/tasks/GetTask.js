const { Task } = require("../../models/TaskModel");

module.exports.getTasks = async (req, res) => {
    let {limit,page} = req.query;
    limit = req.query.limit ? Number(req.query.limit) : 10;
    page = req.query.page ? Number(req.query.page) : 1;

    skip = limit*(page-1);
    let data = {
        user: req.user._id,
        isActive:true
    }
    let tasks = await Task.find(data).sort({order:1,_id:1}).limit(limit).skip(skip);
    let count = await Task.count(data);
    if (tasks) {
        return res.status(200).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: true,
            message: "Task fetched successfully.",
            data: tasks,
            total:count
        });
    } else {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Failed to fetch task."
        });
    }
}