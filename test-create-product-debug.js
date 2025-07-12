const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCreateProduct() {
  try {
    // First, let's get a valid token
    const loginResponse = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@fourleafclover.com',
        password: 'admin123456'
      })
    });

    if (!loginResponse.ok) {
      console.error('Login failed:', loginResponse.status, await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;

    console.log('Got token:', token.substring(0, 20) + '...');

    // Test product data
    const productData = {
      name: 'Test Product',
      description: 'Test description',
      shortDescription: 'Test short description',
      sku: 'TEST-001',
      price: 99.99,
      categoryId: 1,
      material: 'Silver',
      weightGrams: 10.5,
      dimensions: '2cm x 2cm',
      careInstructions: 'Handle with care',
      quantityAvailable: 10,
      isActive: true,
      isFeatured: false
    };

    console.log('Sending product data:', JSON.stringify(productData, null, 2));

    const response = await fetch('http://localhost:3002/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        console.log('Parsed error data:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.log('Could not parse error response as JSON');
      }
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testCreateProduct(); 