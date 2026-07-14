const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  const formData = new FormData();
  
  // Create a 30MB dummy buffer
  const buf = Buffer.alloc(30 * 1024 * 1024, 'a');
  formData.append('productName', 'test');
  formData.append('skuCode', 'test12345');
  formData.append('categoryId', '1');
  formData.append('subCategoryId', '1');
  formData.append('baseTitle', 'test');
  formData.append('productDescription', 'test');
  
  formData.append('variants[0].variantName', 'test');
  formData.append('variants[0].skuCode', 'test-var-12345');
  formData.append('variants[0].images', buf, { filename: 'dummy.png', contentType: 'image/png' });

  try {
    console.log('Sending request...');
    const res = await axios.post('http://localhost:8081/dripdoggy/api/admin/products', formData, {
      headers: formData.getHeaders(),
    });
    console.log('Success:', res.status, res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.status : err.message);
    if (err.response) {
      console.error(err.response.data);
    }
  }
}

testUpload();
