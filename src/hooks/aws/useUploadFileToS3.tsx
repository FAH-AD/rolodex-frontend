import { useState } from "react";

// Services
import { useLazyGetS3SignedUploadUrlQuery } from "@services/s3Api";

// UI Utils
import { showNotification } from "@mantine/notifications";
import { v4 as uuidv4 } from "uuid";
// Icons
import { IconCircleX } from "@tabler/icons";

const useUploadFileToS3 = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Queries
  const [getS3SignedUploadUrl] = useLazyGetS3SignedUploadUrlQuery();

  const uploadFileToS3 = async (
    file: File,
    fileType?: string,
    options?: {
      maxSize?: number;
    }
  ) => {
    try {
      setIsLoading(true);

      if (options?.maxSize && file.size > options.maxSize) {
        throw new Error(
          `File size is too large. Max file size is ${
            options.maxSize / 1024 / 1024
          }MB`
        );
      }
      const uuid = uuidv4();
      const fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1);
      const key = uuid + `.${fileExtension}`;

      const { url: signedUrl } = await getS3SignedUploadUrl({ key }).unwrap();

      await fetch(signedUrl, {
        method: "PUT",
        headers: {
          ...(fileType && { "Content-Type": fileType }),
        },
        body: file,
      });

      return {
        s3URL: `${import.meta.env.VITE_S3_BUCKET_URL}/${key}`,
      };
    } catch (error: any) {
      console.log(error);
      showNotification({
        title: "Error",
        message: error.message || "There was an error uploading your file",
        color: "red",
        icon: <IconCircleX />,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFileToS3, isLoading };
};

export default useUploadFileToS3;
