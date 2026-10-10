const asyncHandler = require('../utils/asyncHandler');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const data = await req.container.notesService.list({
      q: req.query.q,
      categoryId: req.query.categoryId === undefined ? undefined : Number(req.query.categoryId),
      tagId: req.query.tagId === undefined ? undefined : Number(req.query.tagId)
    });
    res.json({ data });
  }),
  get: asyncHandler(async (req, res) => {
    res.json({ data: await req.container.notesService.get(Number(req.params.id)) });
  }),
  create: asyncHandler(async (req, res) => {
    const data = await req.container.notesService.create(req.body);
    res.status(201).json({ data });
  }),
  replace: asyncHandler(async (req, res) => {
    const data = await req.container.notesService.update(Number(req.params.id), {
      ...req.body,
      categoryId: req.body.categoryId ?? null,
      tagIds: req.body.tagIds ?? []
    });
    res.json({ data });
  }),
  update: asyncHandler(async (req, res) => {
    const data = await req.container.notesService.update(Number(req.params.id), req.body);
    res.json({ data });
  }),
  delete: asyncHandler(async (req, res) => {
    await req.container.notesService.delete(Number(req.params.id));
    res.status(204).end();
  })
};
