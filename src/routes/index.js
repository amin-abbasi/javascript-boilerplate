const express = require("express")
const router  = express.Router()

const sampleRouter = require('./sample')

// MS-Sample APIs
router.use('/v1/samples', sampleRouter)

// Health-check Endpoint
router.get('/health', (req, res) => { res.send('200') })

module.exports = router
