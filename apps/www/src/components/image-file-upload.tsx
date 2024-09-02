"use client";
import type { FileUploadSchemaType } from "@parody/core/image/file-upload-schema";
import { FileUploader } from "@parody/ui/file-upload";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	type UseFormReturn,
} from "@parody/ui/form";

export function ImageFileUpload({
	form,
	isUploading,
	progresses,
}: {
	form: UseFormReturn<FileUploadSchemaType>;
	progresses?: Record<string, number>;
	isUploading: boolean;
}) {
	return (
		<FormField
			control={form.control}
			name="images"
			render={({ field }) => (
				<div className="space-y-6">
					<FormItem className="w-full">
						<FormLabel className="sr-only">Images</FormLabel>
						<FormControl>
							<FileUploader
								value={field.value}
								onValueChange={field.onChange}
								maxFileCount={10}
								maxSize={10 * 1024 * 1024}
								progresses={progresses}
								disabled={isUploading}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</div>
			)}
		/>
	);
}
