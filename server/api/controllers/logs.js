const mongoose = require("mongoose");
const Log = require("../models/log");

exports.logs_count = (req, res) => {
    Log.countDocuments({})
        .exec()
        .then(count => {
            res.json({ count: count });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.logs_get_all = (req, res) => {
    Log.find()
        .select("_id author subject timeStamp content")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                logs: docs.map(doc => {
                    return {
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        },
                        _id: doc._id,
                        author: doc.author,
                        subject: doc.subject,
                        timeStamp: doc.timeStamp,
                        content: doc.content
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.logs_get_page = (req, res) => {
    const pageNumber = req.params.pageNumber;
    const firstLog = pageNumber*6 - 6;
    Log.find()
        .select("_id author subject timeStamp content")
        .sort({"_id":1})
        .exec()
        .then(docs => {
            const responseAll = {
                count: docs.length,
                logs: docs.map(doc => {
                    return {
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        },
                        _id: doc._id,
                        author: doc.author,
                        subject: doc.subject,
                        timeStamp: doc.timeStamp,
                        content: doc.content
                    };
                })
            };
            let responsePage = [];
            for (let i=firstLog; i<firstLog+6; i++) {
                if (i < responseAll.count) {
                    responsePage.push(responseAll.logs[responseAll.count - i - 1]);
                } else {
                    responsePage.push(null);
                }
            }
            res.status(200).json(responsePage);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.logs_create_log = (req, res) => {
    console.log(req.body);
    const log = new Log({
        _id: new mongoose.Types.ObjectId(),
        author: req.body.author,
        subject: req.body.subject,
        timeStamp: req.body.timeStamp,
        content: req.body.content
    });
    log
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created log successfully",
                createdlog: {
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/logs/" + result._id
                    },
                    _id: result._id,
                    author: result.author,
                    subject: result.subject,
                    timeStamp: result.timeStamp,
                    content: result.content
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.logs_get_log = (req, res, next) => {
    const id = req.params.logId;
    Log.findById(id)
        .select("_id author subject timeStamp content")
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    log: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/logs"
                    }
                });
            } else {
                res
                    .status(404)
                    .json({
                        message: "No valid entry found for provided ID" });
                    }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};


//body should by array of objects with form:
// { "propName": item to change, "value": what to change it to}
exports.logs_update_log = (req, res, next) => {
    const id = req.params.logId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Log
        .updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Log updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/logs/" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.logs_delete = (req, res, next) => {
  const id = req.params.logId;
  Log.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Log deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/logs",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};