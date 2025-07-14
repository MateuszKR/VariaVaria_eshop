const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testImageUrls() {
  try {
    // Test getting a product with images
    console.log('Testing product images...');
    const response = await fetch('http://localhost:3002/products/1');
    
    if (!response.ok) {
      console.error('Failed to fetch product:', response.status);
      return;
    }

    const data = await response.json();
    console.log('Product data:', JSON.stringify(data, null, 2));

    if (data.product && data.product.images) {
      console.log('\nImage URLs:');
      data.product.images.forEach((image, index) => {
        console.log(`Image ${index + 1}:`, image.url);
      });
    } else {
      console.log('No images found for this product');
    }

    // Test getting all products to see primary images
    console.log('\nTesting products list...');
    const productsResponse = await fetch('http://localhost:3002/products?limit=3');
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log('\nProducts with primary images:');
      productsData.products.forEach((product, index) => {
        console.log(`Product ${index + 1} (${product.name}):`, product.primaryImage?.url || 'No primary image');
      });
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testImageUrls(); 