const { Router } = require('express');
const { body, param, query } = require('express-validator');
const controller = require('../controllers/notesController');
const validate = require('../middleware/validate');
const requireAnyBodyField = require('../middleware/requireAnyBodyField');

const router = Router();
const idRule = param('id').isInt({ min: 1 }).withMessage('id must be a positive integer');
const titleRule = () => body('title').trim().isLength({ min: 1, max: 160 }).withMessage('title must be 1-160 characters');
const contentRule = () => body('content').trim().isLength({ min: 1 }).withMessage('content is required');
const categoryRule = () => body('categoryId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('categoryId must be a positive integer or null').toInt();
const tagIdsRule = () => body('tagIds').optional().isArray().withMessage('tagIds must be an array');
const tagIdItemsRule = () => body('tagIds.*').optional().isInt({ min: 1 }).withMessage('each tagIds item must be a positive integer').toInt();

router.get('/', query('q').optional().isString(), query('categoryId').optional().isInt({ min: 1 }), query('tagId').optional().isInt({ min: 1 }), validate, controller.list);
router.get('/:id', idRule, validate, controller.get);
router.post('/', titleRule(), contentRule(), categoryRule(), tagIdsRule(), tagIdItemsRule(), validate, controller.create);
router.put('/:id', idRule, titleRule(), contentRule(), categoryRule(), tagIdsRule(), tagIdItemsRule(), validate, controller.replace);
router.patch('/:id', idRule, titleRule().optional(), contentRule().optional(), categoryRule(), tagIdsRule(), tagIdItemsRule(), requireAnyBodyField('title', 'content', 'categoryId', 'tagIds'), validate, controller.update);
router.delete('/:id', idRule, validate, controller.delete);

module.exports = router;
