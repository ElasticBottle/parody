import { z } from "zod";

export const ProductNameSchema = z.object({
	productName: z.string().min(3, "Product name must be at least 3 characters"),
});
export type ProductNameSchemaType = z.infer<typeof ProductNameSchema>;
