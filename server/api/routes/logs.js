const express = require("express");
const router = express.Router();
const LogsController = require('../controllers/logs');


router.get("/", LogsController.logs_get_all);

router.post("/", LogsController.logs_create_log);

router.get("/:logId", LogsController.logs_get_log);

router.patch("/:logId", LogsController.logs_update_log);

router.delete("/:logId", LogsController.logs_delete);

module.exports = router;