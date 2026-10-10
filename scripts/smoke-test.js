const assert = require('node:assert/strict');

const baseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:3000';
const checks = [];

async function request(method, route, body) {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: body === undefined ? {} : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch {
    // Keep the raw response in assertion messages if the API returns non-JSON.
  }
  return { status: response.status, json, text };
}

function expectStatus(result, status, label) {
  assert.equal(result.status, status, `${label}: expected ${status}, got ${result.status}; body=${result.text}`);
  checks.push(label);
}

async function run() {
  let categoryId;
  let tagId;
  let noteId;
  let boundaryNoteId;
  const suffix = Date.now();

  try {
    expectStatus(await request('GET', '/health'), 200, 'Health endpoint');

    let response = await request('POST', '/api/categories', {
      name: `Smoke category ${suffix}`,
      description: 'Created by the API smoke test'
    });
    expectStatus(response, 201, 'Create category');
    categoryId = response.json.data.id;

    response = await request('GET', '/api/categories');
    expectStatus(response, 200, 'List categories');
    assert.ok(response.json.data.some((item) => item.id === categoryId));
    response = await request('GET', `/api/categories/${categoryId}`);
    expectStatus(response, 200, 'Read category');
    response = await request('PATCH', `/api/categories/${categoryId}`, { description: 'Updated description' });
    expectStatus(response, 200, 'Patch category');
    response = await request('PUT', `/api/categories/${categoryId}`, { name: `Replaced category ${suffix}` });
    expectStatus(response, 200, 'Replace category');

    response = await request('POST', '/api/tags', { name: `smoke-${suffix}` });
    expectStatus(response, 201, 'Create tag');
    tagId = response.json.data.id;
    response = await request('GET', '/api/tags');
    expectStatus(response, 200, 'List tags');
    assert.ok(response.json.data.some((item) => item.id === tagId));
    response = await request('GET', `/api/tags/${tagId}`);
    expectStatus(response, 200, 'Read tag');
    response = await request('PATCH', `/api/tags/${tagId}`, { name: `updated-${suffix}` });
    expectStatus(response, 200, 'Patch tag');
    response = await request('PUT', `/api/tags/${tagId}`, { name: `replaced-${suffix}` });
    expectStatus(response, 200, 'Replace tag');

    response = await request('POST', '/api/notes', {
      title: `Smoke note ${suffix}`,
      content: 'Searchable smoke-test content',
      categoryId,
      tagIds: [tagId]
    });
    expectStatus(response, 201, 'Create note');
    noteId = response.json.data.id;
    response = await request('GET', '/api/notes');
    expectStatus(response, 200, 'List notes');
    assert.ok(response.json.data.some((item) => item.id === noteId));
    response = await request('GET', `/api/notes/${noteId}`);
    expectStatus(response, 200, 'Read note');

    for (const [query, label] of [
      ['?q=Searchable', 'Search notes by text'],
      [`?categoryId=${categoryId}`, 'Filter notes by category'],
      [`?tagId=${tagId}`, 'Filter notes by tag']
    ]) {
      response = await request('GET', `/api/notes${query}`);
      expectStatus(response, 200, label);
      assert.ok(response.json.data.some((item) => item.id === noteId), `${label}: created note missing`);
    }

    response = await request('PATCH', `/api/notes/${noteId}`, { title: `Patched note ${suffix}` });
    expectStatus(response, 200, 'Patch note');
    response = await request('PUT', `/api/notes/${noteId}`, {
      title: `Replaced note ${suffix}`,
      content: 'Replacement content'
    });
    expectStatus(response, 200, 'Replace note');
    assert.equal(response.json.data.categoryId, null, 'PUT should clear an omitted category');

    response = await request('POST', '/api/notes', { title: 'x'.repeat(160), content: 'Boundary title' });
    expectStatus(response, 201, 'Accept 160-character title');
    boundaryNoteId = response.json.data.id;
    expectStatus(await request('POST', '/api/notes', { title: '', content: 'Empty title' }), 400, 'Reject empty title');
    expectStatus(await request('POST', '/api/notes', { title: 'x'.repeat(161), content: 'Too long' }), 400, 'Reject 161-character title');
    expectStatus(await request('POST', '/api/notes', {}), 400, 'Reject missing note fields');
    expectStatus(await request('GET', '/api/notes/not-an-id'), 400, 'Reject invalid note ID');
    expectStatus(await request('GET', '/api/notes/2147483647'), 404, 'Return 404 for missing note');

    expectStatus(await request('DELETE', `/api/notes/${boundaryNoteId}`), 204, 'Delete boundary note');
    boundaryNoteId = undefined;
    expectStatus(await request('DELETE', `/api/notes/${noteId}`), 204, 'Delete note');
    noteId = undefined;
    expectStatus(await request('DELETE', `/api/categories/${categoryId}`), 204, 'Delete category');
    categoryId = undefined;
    expectStatus(await request('DELETE', `/api/tags/${tagId}`), 204, 'Delete tag');
    tagId = undefined;

    console.log(`PASS: ${checks.length} API checks against ${baseUrl}`);
    for (const check of checks) console.log(`- ${check}`);
  } finally {
    if (noteId) await request('DELETE', `/api/notes/${noteId}`).catch(() => {});
    if (boundaryNoteId) await request('DELETE', `/api/notes/${boundaryNoteId}`).catch(() => {});
    if (categoryId) await request('DELETE', `/api/categories/${categoryId}`).catch(() => {});
    if (tagId) await request('DELETE', `/api/tags/${tagId}`).catch(() => {});
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
