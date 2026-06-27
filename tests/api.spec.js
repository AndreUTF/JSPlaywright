import { test, expect } from '@playwright/test';

test.describe('API Testing with Playwright', () => {
  const apiBaseUrl = 'https://jsonplaceholder.typicode.com';

  test('should fetch a single post (GET)', async ({ request }) => {
    // 1. Send GET request
    const response = await request.get(`${apiBaseUrl}/posts/1`);

    // 2. Assert status is successful (200 OK)
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // 3. Assert response body fields
    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('body');
  });

  test('should create a new post successfully (POST)', async ({ request }) => {
    const postPayload = {
      title: 'Playwright API Testing',
      body: 'Testing REST APIs with Playwright is fast and built-in.',
      userId: 1,
    };

    // 1. Send POST request with JSON payload
    const response = await request.post(`${apiBaseUrl}/posts`, {
      data: postPayload,
    });

    // 2. Assert created status (201 Created)
    expect(response.status()).toBe(201);

    // 3. Assert returned object contains the data we sent
    const body = await response.json();
    expect(body.title).toBe(postPayload.title);
    expect(body.body).toBe(postPayload.body);
    expect(body.userId).toBe(postPayload.userId);
    expect(body).toHaveProperty('id'); // API generates a new ID
  });

  test('should update an existing post (PUT)', async ({ request }) => {
    const updatePayload = {
      id: 1,
      title: 'Updated Playwright Title',
      body: 'Updated body content.',
      userId: 1,
    };

    // 1. Send PUT request to update resource
    const response = await request.put(`${apiBaseUrl}/posts/1`, {
      data: updatePayload,
    });

    // 2. Assert status is 200 OK
    expect(response.status()).toBe(200);

    // 3. Assert fields have updated successfully
    const body = await response.json();
    expect(body.title).toBe(updatePayload.title);
    expect(body.body).toBe(updatePayload.body);
  });

  test('should delete an existing post (DELETE)', async ({ request }) => {
    // 1. Send DELETE request
    const response = await request.delete(`${apiBaseUrl}/posts/1`);

    // 2. Assert success status code (200 OK or 204 No Content are standard, placeholder returns 200)
    expect(response.status()).toBe(200);
  });
});
