const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const path = require('path');

async function testUploadNewImage() {
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

    // Step 2: Create a test product
    console.log('\n2. Creating a test product...');
    const productData = {
      name: 'Test Upload Image Product',
      description: 'Test product for image upload',
      shortDescription: 'Test upload',
      sku: 'TEST-UPLOAD-' + Date.now(),
      price: 99.99,
      material: 'Test Material',
      dimensions: 'Test dimensions',
      careInstructions: 'Test care',
      quantityAvailable: 10,
      isActive: true,
      isFeatured: false
    };

    const createResponse = await fetch('http://localhost:3002/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!createResponse.ok) {
      console.error('Failed to create product:', createResponse.status, await createResponse.text());
      return;
    }

    const createResult = await createResponse.json();
    const productId = createResult.product.id;
    console.log(`✓ Product created with ID: ${productId}`);

    // Step 3: Create a simple test image (1x1 pixel PNG)
    console.log('\n3. Creating test image...');
    const testImagePath = path.join(__dirname, 'test-image.png');
    
    // Create a minimal PNG file (1x1 pixel, transparent)
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // IHDR
      0x00, 0x00, 0x00, 0x01, // width: 1
      0x00, 0x00, 0x00, 0x01, // height: 1
      0x08, 0x06, 0x00, 0x00, 0x00, // bit depth, color type, etc.
      0x1F, 0x15, 0xC4, 0x89, // CRC
      0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
      0x49, 0x44, 0x41, 0x54, // IDAT
      0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
      0x00, 0x00, 0x00, 0x00, // IEND chunk length
      0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    
    fs.writeFileSync(testImagePath, pngData);
    console.log('✓ Test image created');

    // Step 4: Upload the test image
    console.log('\n4. Uploading test image...');
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath));
    formData.append('altText', 'Test uploaded image');
    formData.append('isPrimary', 'true');

    const uploadResponse = await fetch(`http://localhost:3002/admin/products/${productId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      console.error('Failed to upload image:', uploadResponse.status, await uploadResponse.text());
      return;
    }

    const uploadResult = await uploadResponse.json();
    console.log('✓ Image uploaded successfully');
    console.log('Image URL:', uploadResult.image.url);

    // Step 5: Test if the uploaded image is accessible
    console.log('\n5. Testing image accessibility...');
    const imageUrl = uploadResult.image.url;
    
    try {
      const imageResponse = await fetch(imageUrl);
      console.log(`Image URL: ${imageUrl}`);
      console.log(`Status: ${imageResponse.status}`);
      console.log(`Content-Type: ${imageResponse.headers.get('content-type')}`);
      
      if (imageResponse.ok) {
        console.log('✅ Uploaded image is accessible!');
      } else {
        console.log('❌ Uploaded image is not accessible');
      }
    } catch (error) {
      console.log('❌ Error accessing uploaded image:', error.message);
    }

    // Step 6: Test the product in the products list
    console.log('\n6. Testing product in products list...');
    const productsResponse = await fetch('http://localhost:3002/products?limit=5');
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      const testProduct = productsData.products.find(p => p.id === productId);
      if (testProduct) {
        console.log('✓ Product found in products list');
        console.log('Primary image URL:', testProduct.primaryImage?.url);
      } else {
        console.log('❌ Product not found in products list');
      }
    }

    // Clean up
    fs.unlinkSync(testImagePath);
    console.log('\n✓ Test image file cleaned up');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testUploadNewImage(); 