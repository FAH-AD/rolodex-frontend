import React, { useCallback } from "react";

// UI Components
import { LoadingOverlay } from "@mantine/core";
import { Editor, RichTextEditor, RichTextEditorProps } from "@mantine/rte";

// Hooks
import useUploadFileToS3 from "@hooks/aws/useUploadFileToS3";

// Props
type TextEditorProps = RichTextEditorProps & React.RefAttributes<Editor>;

export const TextEditor: React.FC<TextEditorProps> = ({ ...props }) => {
  const { uploadFileToS3, isLoading: isUploadingToS3 } = useUploadFileToS3();

  const onImageUpload = useCallback(async (image: File) => {
    const imageUrl=await uploadFileToS3(image, image.type, {
      maxSize: 10 * 1024 * 1024,
    });

    return imageUrl.s3URL;
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay title="LOADING" visible={isUploadingToS3} />
      <RichTextEditor {...props} onImageUpload={onImageUpload} />
    </div>
  );
};
