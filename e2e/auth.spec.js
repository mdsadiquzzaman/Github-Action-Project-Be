const { test, expect } = require('@playwright/test');

test.describe.serial('Auth API', {tag: '@auth'}, () => {
  test('POST /api/auth/register - should register a new user', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: {
        name: 'Test User',
        email: 'test.user@example.com',
        password: 'password123',
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(body.email).toBe('test.user@example.com');
  });

  test('POST /api/auth/register - should fail with duplicate email', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: {
        name: 'Admin User',
        email: 'admin@example.com', // Already seeded
        password: '123456',
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });

  test('POST /api/auth/login - should login existing user', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'test.user@example.com',
        password: 'password123',
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('token');
  });

  test('POST /api/auth/login - should fail with wrong password', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'admin@example.com',
        password: 'wrongpassword',
      },
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });
});