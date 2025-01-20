import mongoose from "mongoose";

export interface Image extends mongoose.Document {
    fileType: string,
    iv: string,
    fileName: string
}

const ImageSchema = new mongoose.Schema<Image>({
    fileType: {
        type: String,
        required: true
    },
    iv: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    }
})

export default mongoose.models.Image || mongoose.model<Image>("Image", ImageSchema);