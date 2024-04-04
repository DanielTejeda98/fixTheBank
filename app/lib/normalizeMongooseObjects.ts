export default function normalizeMongooseObjects (object: any) {
    return JSON.parse(JSON.stringify(object))
}