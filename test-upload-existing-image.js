const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const path = require('path');

async function testUploadExistingImage() {
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
      name: 'Test Upload Existing Image Product',
      description: 'Test product for image upload with existing file',
      shortDescription: 'Test upload existing',
      sku: 'TEST-UPLOAD-EXISTING-' + Date.now(),
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

    // Step 3: Use an existing image file
    console.log('\n3. Using existing image file...');
    const imagePath = path.join(__dirname, 'graphics', 'varia_varia_sign.jpg');
    
    if (!fs.existsSync(imagePath)) {
      console.error('Image file not found:', imagePath);
      return;
    }
    
    console.log('✓ Using image file:', imagePath);

    // Step 4: Upload the image using a different approach
    console.log('\n4. Uploading image...');
    
    // Create a simple multipart form data manually
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const formData = [];
    
    // Add the image file
    const imageBuffer = fs.readFileSync(imagePath);
    formData.push(`--${boundary}`);
    formData.push('Content-Disposition: form-data; name="image"; filename="varia_varia_sign.jpg"');
    formData.push('Content-Type: image/jpeg');
    formData.push('');
    formData.push(imageBuffer);
    
    // Add other fields
    formData.push(`--${boundary}`);
    formData.push('Content-Disposition: form-data; name="altText"');
    formData.push('');
    formData.push('Test uploaded image from existing file');
    
    formData.push(`--${boundary}`);
    formData.push('Content-Disposition: form-data; name="isPrimary"');
    formData.push('');
    formData.push('true');
    
    formData.push(`--${boundary}--`);
    
    const body = Buffer.concat(formData.map(part => 
      typeof part === 'string' ? Buffer.from(part + '\r\n') : part
    ));

    const uploadResponse = await fetch(`http://localhost:3002/admin/products/${productId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length.toString(),
      },
      body: body,
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

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testUploadExistingImage(); 