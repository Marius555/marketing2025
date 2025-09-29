const { Client, Databases } = require('node-appwrite');
require('dotenv').config();

async function checkDatabaseAttributes() {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setKey(process.env.API_KEY);

    const databases = new Databases(client);

    console.log('🔍 Checking database attributes...');
    console.log('Database ID:', process.env.DATABASE_ID);
    console.log('Collection ID:', process.env.CAMPAIGNS_COLLECTION);

    // Get collection information
    const collection = await databases.getCollection(
      process.env.DATABASE_ID,
      process.env.CAMPAIGNS_COLLECTION
    );

    console.log('\n📋 Collection Details:');
    console.log('Name:', collection.name);
    console.log('Document Security:', collection.documentSecurity);
    console.log('Enabled:', collection.enabled);

    console.log('\n📝 Existing Attributes:');
    console.log('Total attributes:', collection.attributes.length);

    collection.attributes.forEach((attr, index) => {
      console.log(`${index + 1}. ${attr.key}`);
      console.log(`   Type: ${attr.type}`);
      console.log(`   Required: ${attr.required}`);
      if (attr.size) console.log(`   Size: ${attr.size}`);
      if (attr.default !== undefined) console.log(`   Default: ${attr.default}`);
      console.log('');
    });

    console.log('\n🔑 Attribute Keys Only:');
    const attributeKeys = collection.attributes.map(attr => attr.key);
    console.log(attributeKeys.join(', '));

    console.log('\n📊 Indexes:');
    if (collection.indexes && collection.indexes.length > 0) {
      collection.indexes.forEach((index, i) => {
        console.log(`${i + 1}. ${index.key} (${index.type}): [${index.attributes.join(', ')}]`);
      });
    } else {
      console.log('No indexes found');
    }

    // Test payload comparison
    console.log('\n🧪 Payload Comparison:');
    const testPayload = {
      userId: 'test',
      name: 'test',
      platform: 'test',
      budget: 100,
      budgetType: 'daily',
      currency: 'USD',
      dateRangeStart: null,
      dateRangeEnd: null,
      description: '',
      enhanceWithAI: false,
      status: 'draft',
      mediaFileUrl: null,
      mediaFileId: null,
      mediaFileUrls: null,
      mediaFileIds: null
    };

    console.log('Fields we want to send:');
    Object.keys(testPayload).forEach(key => {
      const exists = attributeKeys.includes(key);
      console.log(`  ${key}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    });

  } catch (error) {
    console.error('❌ Error checking database:', error);
    console.error('Error details:', {
      type: error.type,
      code: error.code,
      message: error.message
    });
  }
}

checkDatabaseAttributes();