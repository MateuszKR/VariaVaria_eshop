const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testImageAccess() {
  try {
    // Test 1: Check if the uploaded image URL is accessible
    console.log('1. Testing uploaded image accessibility...');
    const imageUrl = 'http://localhost:3002/uploads/product-1752358693190-322216202.jpg';
    
    try {
      const response = await fetch(imageUrl);
      console.log(`Image URL: ${imageUrl}`);
      console.log(`Status: ${response.status}`);
      console.log(`Content-Type: ${response.headers.get('content-type')}`);
      console.log(`Content-Length: ${response.headers.get('content-length')}`);
      
      if (response.ok) {
        console.log('✅ Image is accessible!');
      } else {
        console.log('❌ Image is not accessible');
      }
    } catch (error) {
      console.log('❌ Error accessing image:', error.message);
    }

    // Test 2: Check if the uploads directory exists in the container
    console.log('\n2. Testing products service health...');
    const healthResponse = await fetch('http://localhost:3002/health');
    if (healthResponse.ok) {
      console.log('✅ Products service is running');
    } else {
      console.log('❌ Products service is not responding');
    }

    // Test 3: Try to access a non-existent image to see the error
    console.log('\n3. Testing non-existent image...');
    try {
      const nonExistentResponse = await fetch('http://localhost:3002/uploads/non-existent.jpg');
      console.log(`Non-existent image status: ${nonExistentResponse.status}`);
    } catch (error) {
      console.log('Error accessing non-existent image:', error.message);
    }

    // Test 4: Check the products service logs
    console.log('\n4. Checking if there are any recent uploads...');
    const productsResponse = await fetch('http://localhost:3002/products?limit=3');
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log('\nRecent products with uploaded images:');
      productsData.products.forEach((product, index) => {
        if (product.primaryImage && product.primaryImage.url.includes('/uploads/')) {
          console.log(`Product ${index + 1} (${product.name}):`);
          console.log(`  - Image URL: ${product.primaryImage.url}`);
          console.log(`  - Filename: ${product.primaryImage.url.split('/').pop()}`);
        }
      });
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testImageAccess(); 