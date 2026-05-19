const { test, expect } = require('./fixtures');

test.describe.serial('Items API (Protected)', {tag: '@items'}, () => {
  let createdItemId;

  test('POST /api/items - should create a new item', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.post('/api/items', {
      data: {
        name: 'E2E Test Monitor',
        description: 'Ultrawide monitor',
        price: 399.99,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe('E2E Test Monitor');
    createdItemId = body._id; // Save ID for later tests
  });

  test('GET /api/items - should return all items', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get('/api/items');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0); // Should have seeded items + created item
  });

  test('GET /api/items/:id - should return a single item', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get(`/api/items/${createdItemId}`);

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body._id).toBe(createdItemId);
  });

  test('PUT /api/items/:id - should update an item', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.put(`/api/items/${createdItemId}`, {
      data: {
        price: 349.99,
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.price).toBe(349.99);
  });

  test('DELETE /api/items/:id - should delete an item', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.delete(`/api/items/${createdItemId}`);

    expect(response.ok()).toBeTruthy();
    
    // Verify it's gone
    const getResponse = await authenticatedRequest.get(`/api/items/${createdItemId}`);
    expect(getResponse.status()).toBe(404);
  });

  test('GET /api/items - should fail without token', async ({ request }) => {
    const response = await request.get('/api/items');
    expect(response.status()).toBe(401);
  });
});