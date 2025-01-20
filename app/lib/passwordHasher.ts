import crypto from 'crypto'

export async function hash (password:string):Promise<string> {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(8).toString("hex");

        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject (err)
            resolve(salt + ":" + derivedKey.toString("hex"));
        })
    })
}

export async function verify (password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":");
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if(err) reject(err);
            resolve(key == derivedKey.toString("hex"));
        })
    })
}

export const encryptFile = (fileData: Buffer<any>) => {
    const secretKey = crypto.createHash('sha256').update(String(process.env.FTB_SECRET)).digest('base64').substr(0, 32);;
    if (!secretKey) {
        throw new Error("No FTB_SECRET set up in ENV");
    }
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypted = cipher.update(fileData);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};

export const decryptFile = (encryptedData: string, iv: string) => {
    const secretKey = crypto.createHash('sha256').update(String(process.env.FTB_SECRET)).digest('base64').substr(0, 32);;
    if (!secretKey) {
        throw new Error("No FTB_SECRET set up in ENV");
    }
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
};