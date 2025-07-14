// Use native fetch if available, otherwise use node-fetch
let fetchFn;
try {
  fetchFn = fetch;
} catch (e) {
  fetchFn = require('node-fetch');
}

async function testProduct21() {
    try {
        console.log('Checking Product ID 21...\n');
        
        const response = await fetchFn('http://localhost:3002/products/21');
        const data = await response.json();
        const product = data.product;
        
        console.log(`Product ID: ${product.id}`);
        console.log(`Name: ${product.name}`);
        console.log(`Primary Image:`, product.primaryImage);
        console.log(`All Images:`, product.images);
        
        if (product.primaryImage) {
            console.log(`\nPrimary Image URL: ${product.primaryImage.url}`);
            console.log(`Primary Image Alt: ${product.primaryImage.alt}`);
        }
        
        if (product.images && product.images.length > 0) {
            console.log('\nAll Images:');
            product.images.forEach((img, i) => {
                console.log(`  Image ${i+1}: ${img.url} (Primary: ${img.isPrimary})`);
            });
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testProduct21(); 