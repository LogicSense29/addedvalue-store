const axios = require('axios');

const API_URL = 'http://localhost:3000/api'; // Adjust if your dev server is on a different port
const TEST_USER_ID = 'test-user-id'; // Replace with a real user ID from your DB for actual testing

async function testCart() {
  console.log('--- Testing Cart API ---');
  
  try {
    // 1. Get empty cart
    console.log('1. Getting cart...');
    const getRes = await axios.get(`${API_URL}/cart?userId=${TEST_USER_ID}`);
    console.log('Initial cart:', getRes.data);

    // 2. Update cart
    console.log('2. Updating cart...');
    const postRes = await axios.post(`${API_URL}/cart`, {
      userId: TEST_USER_ID,
      cart: { "prod_1": 2, "prod_2": 1 }
    });
    console.log('Update response:', postRes.data);

    // 3. Verify update
    console.log('3. Verifying update...');
    const verifyRes = await axios.get(`${API_URL}/cart?userId=${TEST_USER_ID}`);
    console.log('Updated cart:', verifyRes.data);

  } catch (error) {
    console.error('Cart API Test Failed:', error.response ? error.response.data : error.message);
  }
}

async function testOrders() {
  console.log('\n--- Testing Orders API ---');
  
  try {
    // Note: This requires real storeId, addressId, and productIds to avoid DB errors
    console.log('Note: To test orders effectively, ensure valid IDs are used in the payload.');
    
    // Example payload (will likely fail without valid IDs)
    /*
    const orderRes = await axios.post(`${API_URL}/orders`, {
      userId: TEST_USER_ID,
      addressId: 'test-address-id',
      paymentMethod: 'COD',
      items: [
        { productId: 'prod_1', storeId: 'store_1', quantity: 2, price: 100 },
        { productId: 'prod_2', storeId: 'store_1', quantity: 1, price: 50 }
      ]
    });
    console.log('Order response:', orderRes.data);
    */

    console.log('Skipping actual order POST to avoid DB constraint issues during CI/dry run.');
    
    console.log('4. Getting orders...');
    const getOrdersRes = await axios.get(`${API_URL}/orders?userId=${TEST_USER_ID}`);
    console.log('User orders:', getOrdersRes.data);

  } catch (error) {
    console.error('Orders API Test Failed:', error.response ? error.response.data : error.message);
  }
}

async function runTests() {
  await testCart();
  await testOrders();
}

runTests();
