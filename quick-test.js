const http = require('http');

// Quick test to verify backend is working
const req = http.request({
  hostname: 'localhost',
  port: 3002,
  path: '/products/11',
  method: 'GET',
  headers: { 'Accept': 'application/json' }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.product && response.product.images && response.product.images.length > 0) {
        console.log('✅ Backend is working!');
        console.log(`Found ${response.product.images.length} images for product "${response.product.name}"`);
        response.product.images.forEach((img, i) => {
          console.log(`${i+1}. ${img.url} (${img.url.startsWith('http') ? 'Full URL' : 'Relative URL'})`);
        });
      } else {
        console.log('❌ No images found in response');
      }
    } catch (e) {
      console.log('❌ Error parsing response:', e.message);
    }
  });
});

req.on('error', (e) => console.log('❌ Request failed:', e.message));
req.end(); 