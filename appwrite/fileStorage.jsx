"use server"
import { ID, Permission, Role } from "node-appwrite";
import { clientAction } from "./adminOrClient.jsx";

const BUCKET_ID = "68d9406b00363bd294b3";

export async function uploadFile(file, userId) {
  try {
    const client = await clientAction();

    if (!client.storage) {
      throw new Error("Storage client not available");
    }

    const fileId = ID.unique();

    const uploadedFile = await client.storage.createFile(
      BUCKET_ID,
      fileId,
      file,
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ]
    );

    return {
      success: true,
      fileId: uploadedFile.$id,
      fileName: uploadedFile.name,
      fileSize: uploadedFile.sizeOriginal,
      mimeType: uploadedFile.mimeType,
      url: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    };
  } catch (error) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload file"
    };
  }
}

export async function uploadMultipleFiles(files, userId) {
  try {
    const uploadPromises = files.map(file => uploadFile(file, userId));
    const results = await Promise.all(uploadPromises);

    const successful = results.filter(result => result.success);
    const failed = results.filter(result => !result.success);

    return {
      success: failed.length === 0,
      uploaded: successful,
      failed: failed,
      totalUploaded: successful.length,
      totalFailed: failed.length
    };
  } catch (error) {
    console.error("Multiple file upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload files"
    };
  }
}

export async function deleteFile(fileId, userId) {
  try {
    const client = await clientAction();

    if (!client.storage) {
      throw new Error("Storage client not available");
    }

    await client.storage.deleteFile(BUCKET_ID, fileId);

    return {
      success: true,
      message: "File deleted successfully"
    };
  } catch (error) {
    console.error("File deletion error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete file"
    };
  }
}

export async function getFileUrl(fileId) {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
}

export async function getFileDownloadUrl(fileId) {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
}