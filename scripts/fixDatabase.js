const { Client, Databases } = require('node-appwrite');
require('dotenv').config();

async function fixDatabaseSchema() {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setKey(process.env.API_KEY);

    const databases = new Databases(client);

    console.log('🔧 Fixing database schema...');
    console.log('Database ID:', process.env.DATABASE_ID);
    console.log('Collection ID:', process.env.CAMPAIGNS_COLLECTION);

    // Get current collection to see what attributes exist
    const collection = await databases.getCollection(
      process.env.DATABASE_ID,
      process.env.CAMPAIGNS_COLLECTION
    );

    console.log('\n📋 Current attributes:');
    collection.attributes.forEach((attr, index) => {
      console.log(`${index + 1}. ${attr.key} (${attr.type}) - Required: ${attr.required}`);
    });

    // Attributes to remove (these should be auto-created by Appwrite)
    const attributesToRemove = ['createdAt', 'updatedAt'];

    // Remove problematic attributes
    for (const attrKey of attributesToRemove) {
      const existingAttr = collection.attributes.find(attr => attr.key === attrKey);

      if (existingAttr) {
        try {
          console.log(`\n🗑️  Removing attribute: ${attrKey}`);
          await databases.deleteAttribute(
            process.env.DATABASE_ID,
            process.env.CAMPAIGNS_COLLECTION,
            attrKey
          );
          console.log(`✅ Removed: ${attrKey}`);

          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`❌ Failed to remove ${attrKey}:`, error.message);
        }
      } else {
        console.log(`⚠️  Attribute ${attrKey} doesn't exist, skipping...`);
      }
    }

    // Remove createdAt index if it exists
    try {
      console.log('\n🗑️  Removing createdAt index...');
      await databases.deleteIndex(
        process.env.DATABASE_ID,
        process.env.CAMPAIGNS_COLLECTION,
        'createdAt_index'
      );
      console.log('✅ Removed createdAt_index');
    } catch (error) {
      if (error.message?.includes('Index not found')) {
        console.log('⚠️  Index createdAt_index doesn\'t exist, skipping...');
      } else {
        console.error('❌ Failed to remove createdAt_index:', error.message);
      }
    }

    console.log('\n🎉 Database schema fix completed!');
    console.log('✅ Removed manually created createdAt and updatedAt attributes');
    console.log('✅ Appwrite will now automatically manage these timestamps');

  } catch (error) {
    console.error('❌ Fix failed:', error);
    console.error('Error details:', {
      type: error.type,
      code: error.code,
      message: error.message
    });
    process.exit(1);
  }
}

fixDatabaseSchema();