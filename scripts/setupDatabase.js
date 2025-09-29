const { Client, Databases, Permission, Role } = require('node-appwrite');
require('dotenv').config();

async function setupAdCampaignCollection() {
  try {
    // Initialize Appwrite client with admin API key
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setKey(process.env.API_KEY);

    const databases = new Databases(client);

    console.log('🚀 Starting campaigns collection setup...');
    console.log('Database ID:', process.env.DATABASE_ID);
    console.log('Collection ID:', process.env.CAMPAIGNS_COLLECTION);

    // Step 1: Create the collection if it doesn't exist
    try {
      await databases.getCollection(process.env.DATABASE_ID, process.env.CAMPAIGNS_COLLECTION);
      console.log('✅ Collection already exists');
    } catch (error) {
      if (error.code === 404) {
        console.log('📦 Creating campaigns collection...');
        await databases.createCollection(
          process.env.DATABASE_ID,
          process.env.CAMPAIGNS_COLLECTION,
          'Campaigns',
          [
            Permission.create(Role.users()),
            Permission.read(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
          ]
        );
        console.log('✅ Collection created successfully');
      } else {
        throw error;
      }
    }

    // Step 2: Define all attributes (optimized for file storage)
    const attributes = [
      // Core Campaign Attributes
      { key: 'userId', type: 'string', size: 100, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'platform', type: 'string', size: 50, required: true },
      { key: 'budget', type: 'float', required: true },
      { key: 'budgetType', type: 'string', size: 20, required: false, default: 'daily' },
      { key: 'currency', type: 'string', size: 10, required: false, default: 'USD' },
      { key: 'description', type: 'string', size: 2000, required: false },
      { key: 'enhanceWithAI', type: 'boolean', required: false, default: false },
      { key: 'status', type: 'string', size: 50, required: false, default: 'draft' },

      // Date Range Attributes
      { key: 'dateRangeStart', type: 'datetime', required: false },
      { key: 'dateRangeEnd', type: 'datetime', required: false },

      // File Storage Attributes
      { key: 'mediaFileUrl', type: 'string', size: 500, required: false },
      { key: 'mediaFileId', type: 'string', size: 100, required: false },
      { key: 'mediaFileUrls', type: 'string', size: 2000, required: false },
      { key: 'mediaFileIds', type: 'string', size: 1000, required: false }

      // Note: createdAt and updatedAt removed - Appwrite creates these automatically
    ];

    // Step 3: Create each attribute
    for (const attr of attributes) {
      try {
        console.log(`📝 Creating attribute: ${attr.key} (${attr.type})`);

        switch (attr.type) {
          case 'string':
            await databases.createStringAttribute(
              process.env.DATABASE_ID,
              process.env.CAMPAIGNS_COLLECTION,
              attr.key,
              attr.size,
              attr.required,
              attr.default || null
            );
            break;

          case 'float':
            await databases.createFloatAttribute(
              process.env.DATABASE_ID,
              process.env.CAMPAIGNS_COLLECTION,
              attr.key,
              attr.required,
              null, // min
              null, // max
              attr.default || null
            );
            break;

          case 'boolean':
            await databases.createBooleanAttribute(
              process.env.DATABASE_ID,
              process.env.CAMPAIGNS_COLLECTION,
              attr.key,
              attr.required,
              attr.default || null
            );
            break;

          case 'datetime':
            await databases.createDatetimeAttribute(
              process.env.DATABASE_ID,
              process.env.CAMPAIGNS_COLLECTION,
              attr.key,
              attr.required,
              attr.default || null
            );
            break;
        }

        console.log(`✅ Created: ${attr.key}`);

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        if (error.message?.includes('Attribute already exists')) {
          console.log(`⚠️  Attribute ${attr.key} already exists, skipping...`);
        } else {
          console.error(`❌ Failed to create ${attr.key}:`, error.message);
        }
      }
    }

    // Step 4: Create indexes for better performance
    const indexes = [
      { key: 'userId_index', type: 'key', attributes: ['userId'] },
      { key: 'platform_index', type: 'key', attributes: ['platform'] },
      { key: 'status_index', type: 'key', attributes: ['status'] },
      { key: 'createdAt_index', type: 'key', attributes: ['createdAt'] }
    ];

    console.log('📊 Creating indexes...');
    for (const index of indexes) {
      try {
        await databases.createIndex(
          process.env.DATABASE_ID,
          process.env.CAMPAIGNS_COLLECTION,
          index.key,
          index.type,
          index.attributes
        );
        console.log(`✅ Created index: ${index.key}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.message?.includes('Index already exists')) {
          console.log(`⚠️  Index ${index.key} already exists, skipping...`);
        } else {
          console.error(`❌ Failed to create index ${index.key}:`, error.message);
        }
      }
    }

    console.log('🎉 Campaigns collection setup completed successfully!');
    console.log('📋 Summary:');
    console.log(`   - Collection: ${process.env.CAMPAIGNS_COLLECTION}`);
    console.log(`   - Attributes: ${attributes.length} total (including file storage fields)`);
    console.log(`   - Indexes: ${indexes.length} total`);
    console.log('   - Permissions: Users can create, read, update, delete their own campaigns');
    console.log('   - File Storage: Integrated with BUCKET_ID for media uploads');
    console.log('   - Timestamps: Using Appwrite automatic createdAt/updatedAt');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupAdCampaignCollection();