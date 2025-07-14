// Use native fetch if available, otherwise use node-fetch
let fetchFn;
try {
  fetchFn = fetch;
} catch (e) {
  fetchFn = require('node-fetch');
}

async function testCurrentProducts() {
    try {
        console.log('Checking current products in database...\n');
        
        const response = await fetchFn('http://localhost:3002/products');
        const data = await response.json();
        const products = data.products || data;
        
        console.log(`Found ${products.length} products:\n`);
        
        products.forEach((product, index) => {
            console.log(`${index + 1}. Product ID: ${product.id}`);
            console.log(`   Name: ${product.name}`);
            if (product.primaryImage) {
                console.log(`   Primary Image URL: ${product.primaryImage.url}`);
            }
            if (product.images && product.images.length > 0) {
                product.images.forEach((img, i) => {
                    console.log(`   Image ${i+1}: ${img.url}`);
                });
            }
            console.log('');
        });
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testCurrentProducts(); 