const fetch = require('node-fetch');

async function checkUrls() {
    try {
        console.log('Testing API response...\n');
        
        const response = await fetch('http://localhost:3002/products/21');
        const data = await response.json();
        const product = data.product;
        
        console.log('Product ID:', product.id);
        console.log('Name:', product.name);
        
        if (product.primaryImage) {
            console.log('Primary Image URL:', product.primaryImage.url);
        }
        
        if (product.images && product.images.length > 0) {
            console.log('\nAll Image URLs:');
            product.images.forEach((img, i) => {
                console.log(`  Image ${i+1}: ${img.url}`);
            });
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkUrls(); 