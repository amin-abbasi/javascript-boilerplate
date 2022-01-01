const express = require('express')
const router = express.Router()

// Add Controllers & Validators
const Controller = require('../controllers/sample')
const Validator  = require('../validators/sample')
const { checkToken, checkRole } = require('../middlewares/check_auth')


// (action)             (verb)    (URI)
// create:              POST      - /samples
// list:                GET       - /samples
// details:             GET       - /samples/:sampleId
// update:              PUT       - /samples/:sampleId
// delete:              DELETE    - /samples/:sampleId
// do something else:   POST      - /samples/:sampleId/someOtherActionType


// ---------------------------------- Define All Sample Routes Here ----------------------------------

/**
 * @openapi
 * tags:
 *   name: Samples
 *   description: Sample management
 */

/**
 * @openapi
 * /samples/:
 *   post:
 *     summary: Create a new sample
 *     tags: [Samples]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sample'
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('').post(Validator.create, Controller.create)

/**
 * @openapi
 * /samples/:
 *   get:
 *     summary: Get list of all Samples
 *     tags: [Samples]
 *     responses:
 *       "200":
 *         description: Gets a list of samples as an array of objects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Response Status
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       total:
 *                         type: integer
 *                       list:
 *                         $ref: '#/components/schemas/Sample'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('').get(Validator.list, Controller.list)

/**
 * @openapi
 * /samples/{sampleId}:
 *   get:
 *     summary: Sample Details
 *     tags: [Samples]
 *     parameters:
 *       - name: sampleId
 *         in: path
 *         description: Sample ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:sampleId').get(Validator.details, Controller.details)

/**
 * @openapi
 * /samples/{sampleId}:
 *   put:
 *     summary: Sample Update
 *     tags: [Samples]
 *     parameters:
 *       - name: sampleId
 *         in: path
 *         description: Sample ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:sampleId').put(Validator.update, Controller.update)
// router.route('/:sampleId').patch(Validator.update, Controller.update)

/**
 * @openapi
 * /samples/{sampleId}:
 *   delete:
 *     summary: Delete Sample
 *     tags: [Samples]
 *     parameters:
 *       - name: sampleId
 *         in: path
 *         description: Sample ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:sampleId').delete(Validator.delete, Controller.delete)

/**
 * @openapi
 * /samples/{sampleId}/secureAction:
 *   post:
 *     summary: Secure Action For Sample
 *     tags: [Samples]
 *     parameters:
 *       - name: sampleId
 *         in: path
 *         description: Sample ID
 *         required: true
 *         schema:
 *           type: string
 *       - name: authorization
 *         in: header
 *         description: JWT Token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:sampleId/secureAction').post(checkToken, checkRole, Validator.secureAction, Controller.secureAction)

module.exports = router
