const { Router } = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/tagsController');
const validate = require('../middleware/validate');
const requireAnyBodyField = require('../middleware/requireAnyBodyField');

const router = Router();
const idRule = param('id').isInt({ min: 1 }).withMessage('id must be a positive integer');
const nameRule = () => body('name').trim().isLength({ min: 1, max: 40 }).withMessage('name must be 1-40 characters');

router.get('/', controller.list);
router.get('/:id', idRule, validate, controller.get);
router.post('/', nameRule(), validate, controller.create);
router.put('/:id', idRule, nameRule().optional(), requireAnyBodyField('name'), validate, controller.update);
router.patch('/:id', idRule, nameRule().optional(), requireAnyBodyField('name'), validate, controller.update);
router.delete('/:id', idRule, validate, controller.delete);

module.exports = router;
