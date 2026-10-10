const { Router } = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/categoriesController');
const validate = require('../middleware/validate');
const requireAnyBodyField = require('../middleware/requireAnyBodyField');

const router = Router();
const idRule = param('id').isInt({ min: 1 }).withMessage('id must be a positive integer');
const nameRule = () => body('name').trim().isLength({ min: 1, max: 80 }).withMessage('name must be 1-80 characters');
const descriptionRule = () => body('description').optional({ nullable: true }).isString().isLength({ max: 500 }).withMessage('description must be at most 500 characters');

router.get('/', controller.list);
router.get('/:id', idRule, validate, controller.get);
router.post('/', nameRule(), descriptionRule(), validate, controller.create);
router.put('/:id', idRule, nameRule(), descriptionRule(), validate, controller.replace);
router.patch('/:id', idRule, nameRule().optional(), descriptionRule(), requireAnyBodyField('name', 'description'), validate, controller.update);
router.delete('/:id', idRule, validate, controller.delete);

module.exports = router;
