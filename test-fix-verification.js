const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testFixVerification() {
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
    console.log('✓ Login successful');

    // Step 2: Test product creation with no category (this was failing before)
    console.log('\n2. Testing product creation with no category...');
    const productDataNoCategory = {
      name: 'Test Product No Category',
      description: 'Test description',
      shortDescription: 'Test short description',
      sku: 'TEST-NO-CAT-' + Date.now(),
      price: 99.99,
      material: 'Silver',
      dimensions: '2cm x 2cm',
      careInstructions: 'Handle with care',
      quantityAvailable: 10,
      isActive: true,
      isFeatured: false
    };

    console.log('Sending data without categoryId:', JSON.stringify(productDataNoCategory, null, 2));

    const response1 = await fetch('http://localhost:3002/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productDataNoCategory),
    });

    console.log('Response status:', response1.status);
    const responseText1 = await response1.text();
    console.log('Response body:', responseText1);

    if (response1.ok) {
      console.log('✓ SUCCESS: Product created without category!');
    } else {
      console.log('✗ FAILED: Still getting error with no category');
      try {
        const errorData = JSON.parse(responseText1);
        console.log('Error details:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.log('Could not parse error response');
      }
    }

    // Step 3: Test product creation with category
    console.log('\n3. Testing product creation with category...');
    const productDataWithCategory = {
      name: 'Test Product With Category',
      description: 'Test description',
      shortDescription: 'Test short description',
      sku: 'TEST-WITH-CAT-' + Date.now(),
      price: 99.99,
      categoryId: 1,
      material: 'Silver',
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
      body: JSON.stringify(productDataWithCategory),
    });

    console.log('Response status:', response2.status);
    const responseText2 = await response2.text();
    console.log('Response body:', responseText2);

    if (response2.ok) {
      console.log('✓ SUCCESS: Product created with category!');
    } else {
      console.log('✗ FAILED: Error with category');
      try {
        const errorData = JSON.parse(responseText2);
        console.log('Error details:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.log('Could not parse error response');
      }
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testFixVerification(); 