import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  test('should display the main page correctly', async ({ page }) => {
    // Check if the main heading is visible 
    await expect(page.locator('h1')).toContainText('User Management');
    
    // Check if the Guardz logo link is present
    await expect(page.locator('#guardz_logo')).toBeVisible();
    
    // Check if both sections are visible - use more specific selectors
    await expect(page.locator('h2').filter({ hasText: 'Submit Information' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Submitted Users' })).toBeVisible();
  });

  test('should show form validation errors for empty fields', async ({ page }) => {
    // Try to submit the form without filling required fields
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=First name is required')).toBeVisible();
    await expect(page.locator('text=Last name is required')).toBeVisible();
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should successfully submit user information', async ({ page }) => {
    // Fill the form with valid data
    const timestamp = Date.now();
    const uniqueEmail = `john.doe.${timestamp}@example.com`;
    const uniquePhone = `123-456-${timestamp.toString().slice(-4)}`;
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#email', uniqueEmail);
    await page.fill('#phone', uniquePhone);
    await page.fill('#company', 'Test Company');
    
    // Wait for the API call to complete and form to reset
    const responsePromise = page.waitForResponse(response => response.url().includes('/users') && response.request().method() === 'POST');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for the response
    await responsePromise;
    await page.waitForTimeout(500); // Give time for form reset and table update
    
    // Wait for the form to be reset (indicating successful submission)
    await expect(page.locator('#firstName')).toHaveValue('', { timeout: 5000 });
    await expect(page.locator('#lastName')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
    
    // Check if the user appears in the table
    await expect(page.locator('table')).toContainText('John');
    await expect(page.locator('table')).toContainText('Doe');
    await expect(page.locator('table')).toContainText('Test Company');
  });

  test('should display users in the table', async ({ page }) => {
    // First, add a user
    const timestamp = Date.now();
    const uniqueEmail = `testuser.${timestamp}@example.com`;
    const uniquePhone = `555-${timestamp.toString().slice(-7)}`;
    await page.fill('#firstName', 'Jane');
    await page.fill('#lastName', 'Smith');
    await page.fill('#email', uniqueEmail);
    await page.fill('#phone', uniquePhone);
    await page.fill('#company', 'Tech Corp');
    
    // Wait for the API call to complete
    const responsePromise = page.waitForResponse(response => response.url().includes('/users') && response.request().method() === 'POST');
    
    await page.click('button[type="submit"]');
    
    // Wait for the response
    await responsePromise;
    await page.waitForTimeout(500); // Give time for table to update
    
    // Check if the user is displayed in the table - use more specific selector
    await expect(page.locator('table')).toContainText('Jane', { timeout: 5000 });
    await expect(page.locator('table')).toContainText('Smith');
    await expect(page.locator('table')).toContainText(uniqueEmail);
    await expect(page.locator('table')).toContainText('Tech Corp');
  });

  test('should allow searching/filtering users', async ({ page }) => {
    // Add multiple users first
    const baseTimestamp = Date.now();
    const users = [
      { 
        firstName: 'Alice', 
        lastName: 'Johnson', 
        email: `alice.${baseTimestamp}@example.com`, 
        phone: `555-${(baseTimestamp + 1).toString().slice(-7)}`,
        company: 'Alpha Corp' 
      },
      { 
        firstName: 'Bob', 
        lastName: 'Wilson', 
        email: `bob.${baseTimestamp + 2}@example.com`, 
        phone: `555-${(baseTimestamp + 3).toString().slice(-7)}`,
        company: 'Beta LLC' 
      }
    ];
    
    for (const user of users) {
      await page.fill('#firstName', user.firstName);
      await page.fill('#lastName', user.lastName);
      await page.fill('#email', user.email);
      await page.fill('#phone', user.phone);
      await page.fill('#company', user.company);
      
      // Wait for API call to complete
      const responsePromise = page.waitForResponse(response => response.url().includes('/users') && response.request().method() === 'POST');
      
      await page.click('button[type="submit"]');
      
      // Wait for the response
      await responsePromise;
      await page.waitForTimeout(500);
    }
    
    // Wait for table to be populated
    await page.waitForTimeout(1000);
    
    // Test filtering
    await page.fill('input[placeholder="Search all columns..."]', 'Alice');
    await page.waitForTimeout(300); // Give time for filter to apply
    
    // Should show Alice but not Bob
    await expect(page.locator('table')).toContainText('Alice', { timeout: 5000 });
    await expect(page.locator('table')).not.toContainText('Bob');
    
    // Clear filter
    await page.fill('input[placeholder="Search all columns..."]', '');
    await page.waitForTimeout(300); // Give time for filter to clear
    
    // Both should be visible again
    await expect(page.locator('table')).toContainText('Alice', { timeout: 5000 });
    await expect(page.locator('table')).toContainText('Bob');
  });

});