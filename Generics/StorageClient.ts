import { NextCloudClient } from "@/providers/NextCloud";

export interface StorageClient {
    uploadFile(file: Buffer, fileName: string, fileType: string, location: string): Promise<boolean>,
    getFile(fileLocation: string): Promise<string>
}

export class StorageClient {
    storageProvider!: NextCloudClient;
    constructor() {
        if (process.env.NEXTCLOUD_HOST) {
            this.storageProvider = new NextCloudClient();
        }

        if (!this.storageProvider) {
            throw new Error("No storage provider set up")
        }
    }

    async uploadFile(file: Buffer, fileName: string, fileType: string, location: string): Promise<boolean> {
        try {
            return await this.storageProvider.uploadFile(file, fileName, fileType, location);
        } catch (error) {
            throw error;
        }
    }

    async getFile(fileLocation: string): Promise<string> {
        try {
            return await this.storageProvider.getFile(fileLocation);
        } catch (error) {
            throw error;
        }
    }
}