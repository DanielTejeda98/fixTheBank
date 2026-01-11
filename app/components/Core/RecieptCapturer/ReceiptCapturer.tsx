"use client";
import { LucideCamera } from "lucide-react";
import { Button } from "../../ui/button";
import { useRef, useState } from "react";
//@ts-ignore
import jscanify from "jscanify/src/jscanify";
import Script from "next/script";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import NextImage from "next/image";

export default function ReceiptCapturer({
  handleReceiptImageUpload,
  isImageUploading,
}: {
  handleReceiptImageUpload: (file: File | null | undefined) => void;
  isImageUploading: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const fileToUpload = useRef<File>(null);
  const uploadField = useRef<HTMLInputElement>(null);

  async function uploadImageForReceipt(file: File | null | undefined) {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = processImageForReceipt;
    reader.readAsDataURL(file);

    function processImageForReceipt() {
      if (!file) return;
      const scanner = new jscanify();
      const img = new Image();
      img.src = reader.result as string;
      img.onload = function () {
        const resultCanvas = scanner.extractPaper(img, 405, 720);
        const secondPass = scanner.extractPaper(
          resultCanvas,
          405,
          720
        ) as HTMLCanvasElement;
        setImageSrc(secondPass.toDataURL());
        secondPass.toBlob((blob) => {
          if (!blob) return;
          fileToUpload.current = new File([blob], file.name, {
            lastModified: file.lastModified,
            type: "image/png",
          });
        }, "image/png");

        setDialogOpen(true);
      };
    }
  }

  const approveUploadFile = () => {
    if (!fileToUpload.current) return;
    handleReceiptImageUpload(fileToUpload.current);
    setDialogOpen(false);
  };

  return (
    <div>
      <input
        className="hidden"
        type="file"
        accept=".jpeg,.jpg,.png"
        name="receipt"
        onChange={(e) => uploadImageForReceipt(e.target.files?.item(0))}
        disabled={isImageUploading}
        ref={uploadField}
      />
      <Button
        type="button"
        disabled={isImageUploading}
        onClick={() => uploadField.current?.click()}
        className="flex gap-2"
      >
        <LucideCamera /> Auto Detect Receipt (Beta)
      </Button>
      <Script src="https://docs.opencv.org/4.5.0/opencv.js" async></Script>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Auto Reciept Detect Result</DialogTitle>
            <DialogDescription>
              Please review result and accept or deny
            </DialogDescription>
          </DialogHeader>
          <NextImage
            src={imageSrc}
            className="w-full"
            alt="Auto detected reciept"
            width={405}
            height={720}
          />
          <DialogFooter className="flex gap-3 justify-end">
            <Button type="button" onClick={approveUploadFile}>
              Accept
            </Button>
            <DialogClose asChild>
              <Button type="button" variant={"destructive"}>
                Deny
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
