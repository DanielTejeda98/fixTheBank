import dbConnect from "@/app/lib/dbConnect";
import { decryptFile, encryptFile } from "@/app/lib/passwordHasher";
import { StorageClient } from "@/Generics/StorageClient";
import { findBudget } from "@/helpers/budgetHelpers";
import { Budget } from "@/models/budgetModel";
import imageModel, { Image } from "@/models/imageModel";
import mongoose from "mongoose";

export async function uploadImageToBudget (buffer: Buffer, contentType: string, budgetId: string, userId: mongoose.Types.ObjectId) {
    const filename = `${crypto.randomUUID()}`;

    try {
        await dbConnect();
        const budget = await findBudget(userId) as Budget;

        if ((budget._id as mongoose.Types.ObjectId).toString() !== budgetId) {
            throw new Error("Not Authorized");
        }

        const { iv, encryptedData } = encryptFile(buffer);

        await imageModel.create({
            fileType: contentType,
            iv,
            fileName: filename
        });

        const storageClient = new StorageClient();

        const result = await storageClient.uploadFile(Buffer.from(encryptedData), filename, contentType, budgetId);

        return { filename, result };
    } catch (error) {
       throw error; 
    }
}

export async function getImageFromBudget (imageFileName: string, budgetId: string, userId: mongoose.Types.ObjectId) {
    try {
        await dbConnect();
        const budget = await findBudget(userId) as Budget;

        if ((budget._id as mongoose.Types.ObjectId).toString() !== budgetId) {
            throw new Error("Not Authorized");
        }
        const storageClient = new StorageClient();

        const imagePath = `${budgetId}/${imageFileName}`

        const result = await storageClient.getFile(imagePath);
        const findImageData = await imageModel.findOne({ fileName: imageFileName }) as Image;
        if (!findImageData) {
            throw new Error("Decrypt IV for file not found");
        }

        const decryptedResult = decryptFile(result, findImageData.iv);

        return { decryptedResult, fileType: findImageData.fileType };
    } catch (error) {
       throw error; 
    }
}