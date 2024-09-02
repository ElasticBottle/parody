export const bucket = new sst.cloudflare.Bucket("StorageBucket");

export const outputs = {
	bucketName: bucket.name,
};
