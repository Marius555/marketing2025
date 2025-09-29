import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decryptData } from '@/lib/decrypt'
import { adminAction, clientAction } from '@/appwrite/adminOrClient'
import { ID } from 'node-appwrite'


// Helper function to upload files to Appwrite Storage
async function uploadFiles(storage, files, campaignId) {
  console.log('📤 uploadFiles called with:', files?.length || 0, 'files');

  if (!files || files.length === 0) {
    console.log('📤 No files to upload, returning empty array');
    return [];
  }

  if (!Array.isArray(files)) {
    console.error('❌ Files parameter is not an array:', typeof files, files);
    throw new Error('Files parameter must be an array');
  }

  const uploadedFiles = [];
  const uploadErrors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`📁 Processing file ${i}/${files.length}:`, file);

    // Enhanced file validation with detailed logging
    if (!file) {
      const error = `File at index ${i} is null/undefined`;
      console.warn(`⚠️ ${error}`);
      uploadErrors.push(error);
      continue;
    }

    if (typeof file !== 'object') {
      const error = `File at index ${i} is not an object: ${typeof file}`;
      console.warn(`⚠️ ${error}`, file);
      uploadErrors.push(error);
      continue;
    }

    if (!file.name || !file.type) {
      const error = `File at index ${i} missing required properties`;
      console.warn(`⚠️ ${error}:`, {
        name: file.name,
        type: file.type,
        size: file.size,
        constructor: file.constructor?.name
      });
      uploadErrors.push(error);
      continue;
    }

    // Check if it's actually a File or Blob object
    if (!(file instanceof File) && !(file instanceof Blob)) {
      const error = `File at index ${i} is not a File or Blob object: ${file.constructor?.name}`;
      console.warn(`⚠️ ${error}`);
      uploadErrors.push(error);
      continue;
    }

    // Additional file size validation
    if (file.size === 0) {
      const error = `File ${file.name} is empty (0 bytes)`;
      console.warn(`⚠️ ${error}`);
      uploadErrors.push(error);
      continue;
    }

    try {
      const fileId = ID.unique();

      console.log(`📤 Uploading file: ${file.name} as ${fileId}`);
      console.log(`📊 File details: ${file.size} bytes, ${file.type}`);
      console.log(`🆔 Bucket ID: ${process.env.BUCKET_ID}`);

      // Verify storage object is valid
      if (!storage || typeof storage.createFile !== 'function') {
        throw new Error('Invalid storage object - createFile method not available');
      }

      const uploadResult = await storage.createFile(
        process.env.BUCKET_ID,
        fileId,
        file
      );

      console.log('📋 Upload result:', uploadResult);

      if (!uploadResult || !uploadResult.$id) {
        throw new Error('Upload result is missing file ID');
      }

      const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.BUCKET_ID}/files/${uploadResult.$id}/view`;

      const uploadedFile = {
        id: uploadResult.$id,
        url: fileUrl,
        originalName: file.name,
        name: file.name,
        size: file.size,
        type: file.type
      };

      uploadedFiles.push(uploadedFile);

      console.log(`✅ File uploaded successfully: ${file.name} -> ${uploadResult.$id}`);
      console.log(`🔗 File URL: ${fileUrl}`);
    } catch (error) {
      const errorMessage = `Failed to upload file: ${file.name}`;
      console.error(`❌ ${errorMessage}`);
      console.error(`Error type: ${error.type || 'Unknown'}`);
      console.error(`Error code: ${error.code || 'Unknown'}`);
      console.error(`Error message: ${error.message}`);
      console.error(`Full error object:`, JSON.stringify(error, null, 2));

      uploadErrors.push(`${errorMessage} - ${error.message}`);

      // Don't throw here, continue with other files
      // throw new Error(`${errorMessage} - ${error.message}`);
    }
  }

  if (uploadErrors.length > 0) {
    console.warn(`⚠️ ${uploadErrors.length} files failed to upload:`, uploadErrors);
  }

  console.log(`📊 Upload summary: ${uploadedFiles.length} successful, ${uploadErrors.length} failed`);
  return uploadedFiles;
}

export async function POST(request) {
  try {
    // Enhanced environment validation
    console.log('🔧 Validating environment configuration...');
    const requiredEnvVars = {
      DATABASE_ID: process.env.DATABASE_ID,
      CAMPAIGNS_COLLECTION: process.env.CAMPAIGNS_COLLECTION,
      BUCKET_ID: process.env.BUCKET_ID,
      NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
      APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
      APPWRITE_API_KEY: process.env.APPWRITE_API_KEY
    };

    console.log('🔍 Environment variables check:');
    const missingVars = [];
    Object.entries(requiredEnvVars).forEach(([key, value]) => {
      const exists = !!value;
      console.log(`  ${key}: ${exists ? '✅ Present' : '❌ Missing'}`);
      if (!exists) {
        missingVars.push(key);
      }
    });

    if (missingVars.length > 0) {
      const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
      console.error('❌', errorMessage);
      return NextResponse.json(
        { success: false, message: "Server configuration incomplete. Please contact support." },
        { status: 500 }
      );
    }

    console.log('✅ All required environment variables are present');

    // Get cookies
    const cookieStore = await cookies();
    const localSession = cookieStore.get("localSession");

    if (!localSession?.value) {
      return NextResponse.json(
        { success: false, message: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    // Decrypt user session
    let userId;
    try {
      const decryptedData = await decryptData(localSession.value);
      userId = decryptedData.userId || decryptedData;
    } catch (error) {
      console.error("Failed to decrypt session:", error);
      return NextResponse.json(
        { success: false, message: "Invalid session. Please log in again." },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found. Please log in again." },
        { status: 401 }
      );
    }

    // Parse FormData
    const formData = await request.formData();

    // Helper function to parse JSON fields safely
    const parseJsonField = (field) => {
      try {
        return field ? JSON.parse(field) : null;
      } catch (error) {
        console.warn(`Failed to parse JSON field:`, field);
        return null;
      }
    };

    // Extract campaign data from FormData
    const campaignData = {
      name: formData.get('name'),
      platform: formData.get('platform'),
      budget: formData.get('budget'),
      budgetType: formData.get('budgetType') || 'daily',
      currency: formData.get('currency') || 'USD',
      dateRangeStart: formData.get('dateRangeStart') || null,
      dateRangeEnd: formData.get('dateRangeEnd') || null,
      description: formData.get('description') || '',
      enhanceWithAI: formData.get('enhanceWithAI') === 'true',

      // Platform-specific fields
      subreddit: formData.get('subreddit'),
      postType: formData.get('postType'),
      title: formData.get('title'),
      content: formData.get('content'),
      objective: formData.get('objective'),
      audience: parseJsonField(formData.get('audience')),
      adFormat: formData.get('adFormat'),
      creative: formData.get('creative'),
      contentType: formData.get('contentType'),
      caption: formData.get('caption'),
      hashtags: formData.get('hashtags'),
      targetAudience: parseJsonField(formData.get('targetAudience')),
      url: formData.get('url'),
      submissionContent: formData.get('submissionContent')
    };

    // Extract and validate files with enhanced logging
    console.log('=== EXTRACTING FILES FROM FORMDATA ===');

    const mediaFile = formData.get('mediaFile');
    console.log('🔍 Raw mediaFile from FormData:', mediaFile);
    console.log('🔍 mediaFile type:', typeof mediaFile);
    console.log('🔍 mediaFile instanceof File:', mediaFile instanceof File);
    console.log('🔍 mediaFile instanceof Blob:', mediaFile instanceof Blob);
    if (mediaFile instanceof File) {
      console.log('📁 mediaFile details:', {
        name: mediaFile.name,
        size: mediaFile.size,
        type: mediaFile.type,
        lastModified: mediaFile.lastModified
      });
    }

    const rawMediaFiles = formData.getAll('mediaFiles');
    console.log('🔍 Raw mediaFiles from FormData:', rawMediaFiles);
    console.log('🔍 Raw mediaFiles count:', rawMediaFiles.length);

    rawMediaFiles.forEach((file, index) => {
      console.log(`🔍 Raw mediaFiles[${index}]:`, file);
      console.log(`🔍 mediaFiles[${index}] type:`, typeof file);
      console.log(`🔍 mediaFiles[${index}] instanceof File:`, file instanceof File);
      console.log(`🔍 mediaFiles[${index}] instanceof Blob:`, file instanceof Blob);
      if (file instanceof File) {
        console.log(`📁 mediaFiles[${index}] details:`, {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        });
      }
    });

    const mediaFiles = rawMediaFiles.filter(file => {
      const isFile = file instanceof File;
      if (!isFile) {
        console.warn(`⚠️ Filtering out non-File object:`, file, typeof file);
      }
      return isFile;
    });

    console.log('=== CREATING CAMPAIGN ===');
    console.log('Campaign name:', campaignData.name);
    console.log('Platform:', campaignData.platform);
    console.log('Budget:', campaignData.budget);
    console.log('Media file:', mediaFile instanceof File ? `File object detected: ${mediaFile.name}` : `No valid file: ${mediaFile}`);
    console.log('Media files count after filtering:', mediaFiles.length);

    // Additional validation
    if (mediaFile && !(mediaFile instanceof File)) {
      console.error('❌ mediaFile is not a valid File object!');
    }

    mediaFiles.forEach((file, index) => {
      if (!(file instanceof File)) {
        console.error(`❌ mediaFiles[${index}] is not a valid File object!`);
      }
    });

    // Connect to Appwrite - use admin for storage operations, client for database
    console.log('Attempting to connect to Appwrite services...');

    // Get admin connection for storage operations (bypasses user permission issues)
    console.log('Initializing admin connection for storage...');
    const adminActionResult = await adminAction();
    const adminStorage = adminActionResult.storage;

    // Verify admin connection
    if (!adminStorage) {
      console.error('❌ Admin storage connection failed');
      return NextResponse.json(
        { success: false, message: "Admin storage connection not available" },
        { status: 500 }
      );
    }
    console.log('✅ Admin storage connection established');

    // Get client connection for database operations (uses user session)
    const clientActionResult = await clientAction();

    if (clientActionResult.success === false) {
      console.error('Client action failed:', clientActionResult.message);
      return NextResponse.json(
        { success: false, message: clientActionResult.message || "Database connection failed" },
        { status: 500 }
      );
    }

    if (!clientActionResult.databases) {
      console.error('Database connection missing from client action result');
      return NextResponse.json(
        { success: false, message: "Database connection not available" },
        { status: 500 }
      );
    }

    const databases = clientActionResult.databases;
    console.log('Database and admin storage connections established successfully');

    // Verify bucket exists and is accessible with enhanced validation
    try {
      console.log('🔍 Verifying storage bucket access...');
      console.log('🆔 Using bucket ID:', process.env.BUCKET_ID);

      const bucket = await adminStorage.getBucket(process.env.BUCKET_ID);

      console.log('✅ Storage bucket verified successfully');
      console.log('📋 Bucket details:', {
        id: bucket.$id,
        name: bucket.name,
        enabled: bucket.enabled,
        maxFileSize: bucket.maxFileSize,
        allowedFileExtensions: bucket.allowedFileExtensions?.length > 0
          ? bucket.allowedFileExtensions.slice(0, 10)
          : 'All extensions allowed',
        fileSecurity: bucket.fileSecurity,
        permissions: bucket.permissions?.slice(0, 5) || 'No specific permissions'
      });

      // Additional bucket validation
      if (!bucket.enabled) {
        throw new Error('Storage bucket is disabled');
      }

      // Test bucket permissions by attempting to list files
      try {
        console.log('🔍 Testing bucket permissions...');
        const filesList = await adminStorage.listFiles(process.env.BUCKET_ID, [], 1);
        console.log('✅ Bucket permissions verified - can list files');
        console.log('📊 Current file count in bucket:', filesList.total);
      } catch (permError) {
        console.warn('⚠️ Limited bucket access - cannot list files:', permError.message);
        // This might be expected in some configurations, so don't fail here
      }

    } catch (bucketError) {
      console.error('❌ Storage bucket verification failed');
      console.error('Error type:', bucketError.type || 'Unknown');
      console.error('Error code:', bucketError.code || 'Unknown');
      console.error('Error message:', bucketError.message);
      console.error('Full error:', JSON.stringify(bucketError, null, 2));

      let userMessage = 'Storage bucket not accessible. Please check bucket configuration.';

      // Provide more specific error messages based on error type
      if (bucketError.code === 404 || bucketError.message?.includes('not found')) {
        userMessage = `Storage bucket "${process.env.BUCKET_ID}" does not exist. Please verify the bucket ID.`;
      } else if (bucketError.code === 401 || bucketError.message?.includes('unauthorized')) {
        userMessage = 'Insufficient permissions to access storage bucket. Please check API key permissions.';
      } else if (bucketError.code === 403 || bucketError.message?.includes('forbidden')) {
        userMessage = 'Access to storage bucket is forbidden. Please check bucket permissions.';
      }

      return NextResponse.json(
        {
          success: false,
          message: `${userMessage} (Error: ${bucketError.message})`
        },
        { status: 500 }
      );
    }

    // Create campaign payload
    const campaignPayload = {
      userId: userId,
      name: campaignData.name || '',
      platform: campaignData.platform || '',
      budget: parseFloat(campaignData.budget) || 0,
      budgetType: campaignData.budgetType || 'daily',
      currency: campaignData.currency || 'USD',
      dateRangeStart: campaignData.dateRangeStart,
      dateRangeEnd: campaignData.dateRangeEnd,
      description: campaignData.description || '',
      enhanceWithAI: campaignData.enhanceWithAI || false,
      status: 'draft'
    };

    const campaignId = ID.unique();
    let uploadErrors = [];

    // Handle file uploads with comprehensive testing
    console.log('=== FILE UPLOAD PROCESSING START ===');
    console.log('📊 Upload Status Summary:');
    console.log(`  - Single mediaFile: ${mediaFile ? (mediaFile instanceof File ? '✅ Valid File' : '❌ Invalid') : '⚪ None'}`);
    console.log(`  - Multiple mediaFiles: ${mediaFiles.length > 0 ? `✅ ${mediaFiles.length} files` : '⚪ None'}`);

    try {
      // Handle single file (Reddit mediaFile)
      if (mediaFile && mediaFile instanceof File) {
        console.log('🎯 Processing single media file upload...');
        console.log('📋 Single media file details:', {
          name: mediaFile.name,
          type: mediaFile.type,
          size: mediaFile.size,
          lastModified: mediaFile.lastModified,
          isFile: mediaFile instanceof File,
          isBlob: mediaFile instanceof Blob
        });

        try {
          console.log('🚀 Calling uploadFiles for single file...');
          const uploadedFile = await uploadFiles(adminStorage, [mediaFile], campaignId);

          if (uploadedFile.length > 0) {
            campaignPayload.mediaFileUrl = uploadedFile[0].url;
            campaignPayload.mediaFileId = uploadedFile[0].id;
            console.log('✅ Single file uploaded successfully:');
            console.log('   - File ID:', uploadedFile[0].id);
            console.log('   - File URL:', uploadedFile[0].url);
          } else {
            console.warn('⚠️ No files were successfully uploaded from single file');
            uploadErrors.push('Single file upload returned empty result');
          }
        } catch (singleFileError) {
          console.error('❌ Single file upload failed:', singleFileError.message);
          uploadErrors.push(`Failed to upload file: ${singleFileError.message}`);
        }
      } else if (mediaFile) {
        console.warn('⚠️ mediaFile exists but is not a valid File object:', typeof mediaFile, mediaFile);
        uploadErrors.push('mediaFile is not a valid File object');
      } else {
        console.log('💡 No single mediaFile provided');
      }

      // Handle multiple files (Facebook/Instagram mediaFiles)
      if (mediaFiles.length > 0) {
        console.log('🎯 Processing multiple media files upload...');
        console.log(`📋 Multiple media files details (${mediaFiles.length} files):`);

        mediaFiles.forEach((file, index) => {
          console.log(`   File ${index + 1}:`, {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            isFile: file instanceof File,
            isBlob: file instanceof Blob
          });
        });

        try {
          console.log('🚀 Calling uploadFiles for multiple files...');
          const uploadedFiles = await uploadFiles(adminStorage, mediaFiles, campaignId);

          if (uploadedFiles.length > 0) {
            campaignPayload.mediaFileUrls = JSON.stringify(uploadedFiles.map(f => f.url));
            campaignPayload.mediaFileIds = JSON.stringify(uploadedFiles.map(f => f.id));
            console.log('✅ Multiple files uploaded successfully:');
            console.log(`   - Uploaded ${uploadedFiles.length}/${mediaFiles.length} files`);
            uploadedFiles.forEach((file, index) => {
              console.log(`   - File ${index + 1}: ${file.id} (${file.name})`);
            });
          } else {
            console.warn('⚠️ No files were successfully uploaded from multiple files array');
            uploadErrors.push('Multiple files upload returned empty result');
          }
        } catch (multipleFilesError) {
          console.error('❌ Multiple files upload failed:', multipleFilesError.message);
          uploadErrors.push(`Failed to upload files: ${multipleFilesError.message}`);
        }
      } else {
        console.log('💡 No multiple mediaFiles provided');
      }

      console.log('=== FILE UPLOAD PROCESSING COMPLETE ===');
      console.log('📊 Final Upload Summary:');
      console.log(`  - Single file URL: ${campaignPayload.mediaFileUrl || 'Not set'}`);
      console.log(`  - Multiple file URLs: ${campaignPayload.mediaFileUrls ? JSON.parse(campaignPayload.mediaFileUrls).length + ' URLs' : 'Not set'}`);
      console.log(`  - Upload errors: ${uploadErrors.length > 0 ? uploadErrors.length + ' errors' : 'None'}`);

      if (uploadErrors.length > 0) {
        console.warn('⚠️ File upload errors occurred:', uploadErrors);
      }

    } catch (uploadError) {
      console.error("❌ File upload processing failed:", uploadError.message);
      console.error("❌ Stack trace:", uploadError.stack);
      uploadErrors.push(`File upload processing failed: ${uploadError.message}`);
    }

    // Create campaign document
    console.log('Creating campaign document...');

    try {
      const document = await databases.createDocument(
        process.env.DATABASE_ID,
        process.env.CAMPAIGNS_COLLECTION,
        campaignId,
        campaignPayload
      );

      console.log('Campaign successfully created in Appwrite:', document.$id);

      // Provide feedback about upload issues if any occurred
      let successMessage = "Campaign created successfully!";
      if (uploadErrors.length > 0) {
        successMessage = "Campaign created successfully, but some files failed to upload. You can edit the campaign later to add media files.";
      }

      return NextResponse.json({
        success: true,
        message: successMessage,
        campaignId: document.$id,
        data: document,
        uploadErrors: uploadErrors.length > 0 ? uploadErrors : undefined
      });

    } catch (dbError) {
      console.error("Campaign creation failed:", dbError);

      return NextResponse.json(
        { success: false, message: `Failed to create campaign: ${dbError.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create campaign. Please try again." },
      { status: 500 }
    );
  }
}