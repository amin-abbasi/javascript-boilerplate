const express = require('express')
const router  = express.Router()

// Add Controllers & Validators
const Controller = require('../controllers/sample')
const Validator  = require('../validators/sample')

// ---------------------------------- Define all routes in this microservice ----------------------------------


/**
 * This function comment is parsed by doctrine
 * test test test test test test test test
 * @route POST /users
 * @param {Client.model} clients.body.required - the new clients
 * @group Sample - Operations about user
 * @param {string} email.query.required - username or email
 * @param {string} password.query.required - user's password.
 * @param {enum} status.query.required - Status values that need to be considered for filter - eg: available,pending
 * @operationId retrieveFooInfo
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {Response.model} 200 - An array of user info
 * @returns {Product.model}  default - Unexpected error
 * @returns {Array.<Client>} Client - Some description for clients
 * @headers {integer} 200.X-Rate-Limit - calls per hour allowed by the user
 * @headers {string} 200.X-Expires-After - 	date in UTC when token expires
 * @security JWT
 */
router.route('').post(Validator.create, Controller.create)


/**
 * This function comment is parsed by doctrine
 * @route GET /api
 * @group Sample - Operations about user
 * @param {Client.model} clients.body.required - the new clients
 * @param {string} email.query.required - username or email - eg: user@domain.com
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.route('').get(Validator.list, Controller.list)

router.route('/:sampleId').get(Validator.details, Controller.details)
router.route('/:sampleId').put(Validator.update, Controller.update)
// router.route('/:sampleId').patch(Validator.update, Controller.update)
router.route('/:sampleId').delete(Validator.delete, Controller.delete)


module.exports = router
