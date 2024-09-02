import { z } from "zod";

export const FileUploadSchema = z.object({
	images: z.array(z.instanceof(File)).min(5, "Please upload at least 5 images"),
});
export type FileUploadSchemaType = z.infer<typeof FileUploadSchema>;
