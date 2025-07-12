const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugFrontendRequest() {
  try {
    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
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
    console.log('✓ Login successful, token:', token.substring(0, 20) + '...');

    // Step 2: Get categories (like frontend does)
    console.log('\n2. Fetching categories...');
    const categoriesResponse = await fetch('http://localhost:3002/categories');
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      console.log('✓ Categories fetched, count:', categoriesData.categories?.length || 0);
    }

    // Step 3: Try to create product with minimal data (like frontend might send)
    console.log('\n3. Testing product creation with minimal data...');
    const minimalProductData = {
      name: 'Debug Test Product',
      description: 'Debug test',
      shortDescription: 'Debug test',
      sku: 'DEBUG-' + Date.now(), // Unique SKU
      price: 50.00,
      categoryId: null,
      material: '',
      weightGrams: null,
      dimensions: '',
      careInstructions: '',
      quantityAvailable: 0,
      isActive: true,
      isFeatured: false
    };

    console.log('Sending minimal data:', JSON.stringify(minimalProductData, null, 2));

    const response = await fetch('http://localhost:3002/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(minimalProductData),
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        console.log('Parsed error data:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.log('Could not parse error response as JSON');
      }
    } else {
      console.log('✓ Product created successfully with minimal data');
    }

    // Step 4: Try with full data (like our working test)
    console.log('\n4. Testing product creation with full data...');
    const fullProductData = {
      name: 'Debug Test Product Full',
      description: 'Debug test full description',
      shortDescription: 'Debug test short',
      sku: 'DEBUG-FULL-' + Date.now(),
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

    const response2 = await fetch('http://localhost:3002/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(fullProductData),
    });

    console.log('Response status:', response2.status);
    const responseText2 = await response2.text();
    console.log('Response body:', responseText2);

    if (!response2.ok) {
      try {
        const errorData = JSON.parse(responseText2);
        console.log('Parsed error data:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.log('Could not parse error response as JSON');
      }
    } else {
      console.log('✓ Product created successfully with full data');
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

debugFrontendRequest(); 