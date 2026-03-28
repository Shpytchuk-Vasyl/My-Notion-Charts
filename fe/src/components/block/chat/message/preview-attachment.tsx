import Image from "next/image";
import type { Attachment } from "../types";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  onRemove,
}: {
  attachment: Attachment;
  isUploading?: boolean;
  onRemove?: () => void;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div className="group relative size-16 overflow-hidden rounded-lg bg-muted">
      {contentType?.startsWith("image") ? (
        <Image
          alt={name ?? "An image attachment"}
          className="size-full object-cover"
          height={64}
          src={url}
          width={64}
        />
      ) : (
        <p className="flex size-full items-center justify-center text-muted-foreground text-xs">
          File
        </p>
      )}

      {isUploading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50"
          data-testid="input-attachment-loader"
        >
          <Spinner />
        </div>
      )}

      {onRemove && !isUploading && (
        <Button
          className="absolute top-0.5 right-0.5 size-4 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={onRemove}
          size="sm"
          variant="destructive"
        >
          <XIcon className="size-3" />
        </Button>
      )}

      <span className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/80 to-transparent px-1 py-0.5 text-xs text-white">
        {name}
      </span>
    </div>
  );
};
