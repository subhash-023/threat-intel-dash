const express = require("express")
const apiRouter = express.Router()
const apiController = require("../controllers/apiController")

apiRouter.get("/threats", apiController.getThreats)
apiRouter.get("/threats/stats", apiController.getThreatStats)
apiRouter.get("/threats/:threatId", apiController.getThreatsById)

module.exports = apiRouter