const { test, expect } = require('./fixtures');

// Use .serial to run tests in sequence and share the createdBrandId variable
test.describe.serial('Brands API (Protected)', {tag: '@brands'}, () => {
  let createdBrandId;

  test('POST /api/brands - should create a new brand', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.post('/api/brands', {
      data: {
        name: 'E2E Brand Corp',
        description: 'Top tier e2e testing brand',
        website: 'https://e2ebrand.com',
        country: 'Canada'
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe('E2E Brand Corp');
    
    // Assign to the variable defined in the describe block
    createdBrandId = body._id; 
  });

  test('GET /api/brands - should return all brands', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get('/api/brands');

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET /api/brands/:id - should return a single brand', async ({ authenticatedRequest }) => {
    // Now createdBrandId will be defined because the POST test ran first
    const response = await authenticatedRequest.get(`/api/brands/${createdBrandId}`);

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body._id).toBe(createdBrandId);
  });

  test('PUT /api/brands/:id - should update a brand', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.put(`/api/brands/${createdBrandId}`, {
      data: {
        country: 'USA',
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.country).toBe('USA');
  });

  test('DELETE /api/brands/:id - should delete a brand', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.delete(`/api/brands/${createdBrandId}`);

    expect(response.ok()).toBeTruthy();
    
    // Verify it's gone
    const getResponse = await authenticatedRequest.get(`/api/brands/${createdBrandId}`);
    expect(getResponse.status()).toBe(404);
  });

  test('POST /api/brands - should fail without token', async ({ request }) => {
    const response = await request.post('/api/brands', {
      data: { name: 'Fail Brand' }
    });
    expect(response.status()).toBe(401);
  });
});