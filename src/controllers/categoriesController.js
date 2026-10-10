const asyncHandler = require('../utils/asyncHandler');

module.exports = {
  list: asyncHandler(async (req, res) => {
    res.json({ data: await req.container.categoriesService.list() });
  }),
  get: asyncHandler(async (req, res) => {
    res.json({ data: await req.container.categoriesService.get(Number(req.params.id)) });
  }),
  create: asyncHandler(async (req, res) => {
    res.status(201).json({ data: await req.container.categoriesService.create(req.body) });
  }),
  replace: asyncHandler(async (req, res) => {
    res.json({ data: await req.container.categoriesService.update(Number(req.params.id), {
      name: req.body.name,
      description: req.body.description ?? null
    }) });
  }),
  update: asyncHandler(async (req, res) => {
    res.json({ data: await req.container.categoriesService.update(Number(req.params.id), req.body) });
  }),
  delete: asyncHandler(async (req, res) => {
    await req.container.categoriesService.delete(Number(req.params.id));
    res.status(204).end();
  })
};
