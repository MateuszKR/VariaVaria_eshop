const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testUploadedImages() {
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

    // Step 2: Get all products to see image URLs
    console.log('\n2. Testing products list with images...');
    const productsResponse = await fetch('http://localhost:3002/products?limit=5');
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log('\nProducts with primary images:');
      productsData.products.forEach((product, index) => {
        console.log(`Product ${index + 1} (${product.name}):`);
        console.log(`  - Primary Image URL: ${product.primaryImage?.url || 'No primary image'}`);
        console.log(`  - Image Alt: ${product.primaryImage?.alt || 'N/A'}`);
      });
    }

    // Step 3: Test a specific product with multiple images
    console.log('\n3. Testing product detail with all images...');
    const productResponse = await fetch('http://localhost:3002/products/1');
    
    if (productResponse.ok) {
      const productData = await productResponse.json();
      console.log('\nProduct images:');
      if (productData.product.images && productData.product.images.length > 0) {
        productData.product.images.forEach((image, index) => {
          console.log(`  Image ${index + 1}:`);
          console.log(`    - URL: ${image.url}`);
          console.log(`    - Alt: ${image.alt}`);
          console.log(`    - Is Primary: ${image.isPrimary}`);
        });
      } else {
        console.log('  No images found for this product');
      }
    }

    // Step 4: Test admin products endpoint
    console.log('\n4. Testing admin products endpoint...');
    const adminProductsResponse = await fetch('http://localhost:3002/admin/products?limit=3', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    if (adminProductsResponse.ok) {
      const adminProductsData = await adminProductsResponse.json();
      console.log('\nAdmin products with primary images:');
      adminProductsData.products.forEach((product, index) => {
        console.log(`Product ${index + 1} (${product.name}):`);
        console.log(`  - Primary Image URL: ${product.primaryImage?.url || 'No primary image'}`);
        console.log(`  - Image Alt: ${product.primaryImage?.alt || 'N/A'}`);
      });
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testUploadedImages(); 