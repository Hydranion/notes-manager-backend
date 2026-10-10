const asyncHandler = require('../utils/asyncHandler');

module.exports = {
  list: asyncHandler(async (req, res) => {
    res.json({ data: await req.container.tagsService.list() });
  }),
  get: asyncHandler(async (req, res) => {
    res.json({ data: await req.container.tagsService.get(Number(req.params.id)) });
  }),
  create: asyncHandler(async (req, res) => {
    res.status(201).json({ data: await req.container.tagsService.create(req.body) });
  }),
  update: asyncHandler(async (req, res) => {
    res.json({ data: await req.container.tagsService.update(Number(req.params.id), req.body) });
  }),
  delete: asyncHandler(async (req, res) => {
    await req.container.tagsService.delete(Number(req.params.id));
    res.status(204).end();
  })
};
