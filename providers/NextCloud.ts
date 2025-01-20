export interface NextCloudClient {
    uploadFile(file: Buffer, fileName: string, fileType: string, location: string): Promise<boolean>,
    getFile(fileLocation: string): Promise<string>
}

export class NextCloudClient {
    nextCloudHeaders = {
        "Authorization": `Basic ${Buffer.from(`${process.env.NEXTCLOUD_AUTH}`).toString("base64")}`,
        "OCS-APIRequest": "true"
    }

    host = process.env.NEXTCLOUD_HOST;
    path = process.env.NEXTCLOUD_PATH;
    user = process.env.NEXTCLOUD_USER;
    
    constructor() {
        // Check if any values are missing
        if (!(this.host && this.path && this.user && process.env.NEXTCLOUD_AUTH)) {
            console.error("NextCloudClient: Missing required ENV variables. Please check your ENV file.")
            console.error("NextCloudClient: Mssing NEXTCLOUD_AUTH or NEXTCLOUD_HOST or NEXTCLOUD_PATH or NEXTCLOUD_USER")
        }
    }
    
    async checkPath (folderPath: string) {
        try {
            const nextCloudResponse = await fetch(`${this.host}/ocs/v2.php/apps/files_sharing/api/v1/shares?path=${this.path}${folderPath}&format=json`, {
                method: "GET",
                headers: this.nextCloudHeaders
            })
            const nextCloudResponseBody = await nextCloudResponse.json();
            console.log("CheckPath Result: ", nextCloudResponseBody.ocs.meta.statuscode)
            return nextCloudResponseBody.ocs.meta.statuscode !== 404
        } catch (error) {
            throw error;
        }
    }

    async uploadFile (file: Buffer, fileName: string, fileType: string, location: string) {
        if (!await this.checkPath(location)) {
            const nextCloudCreateShareResponse = await fetch(`${this.host}/remote.php/dav/files/${this.user}/${this.path}${location}`, {
                method: "MKCOL",
                headers: this.nextCloudHeaders
            })

            if (nextCloudCreateShareResponse.status !== 201) {
                throw new Error("NextCloud Connection Error: Unable to create share for budget!");
            }
        }

        const fileUploadResponse = await fetch(`${this.host}/remote.php/dav/files/${this.user}/${this.path}/${location}/${fileName}`, {
            method: "PUT",
            headers: {...this.nextCloudHeaders, "Content-Type": fileType },
            body: file
        })

        return fileUploadResponse.status === 201;
    }

    async getFile (fileLocation: string) {
        const nextCloudResponse = await fetch(`${this.host}/remote.php/dav/files/${this.user}/${this.path}${fileLocation}`, {
            method: "GET",
            headers: this.nextCloudHeaders
        })

        return await nextCloudResponse.text()
    }
}