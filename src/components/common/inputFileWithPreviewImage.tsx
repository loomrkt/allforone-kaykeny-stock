import { Image } from "@/interfaces/common";
import { truncateText } from "@/lib/utils";
import { ImagePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import PreviewFile from "./previewFile";

interface InputFileWithPreviewProps {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  isUpdate?: boolean;
  updateName?: string;
  defaultFiles?: Image;
  isReset?: boolean;
  onChange?: (file: File | undefined) => void;
}

export const InputFileWithPreviewImage = ({
  name,
  form,
  label,
  isUpdate,
  updateName,
  defaultFiles,
  isReset,
  onChange,
}: InputFileWithPreviewProps) => {
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [previewDefaultFile, setPreviewDefaultFile] = useState<
    Image | undefined
  >(defaultFiles);
  const [file, setFile] = useState<File | null>(null);

  const handleChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      form.setValue(isUpdate && updateName ? updateName : name, selectedFile);
      setFile(selectedFile);
      setPreviewFile(URL.createObjectURL(selectedFile));
      setPreviewDefaultFile(undefined);
      onChange?.(selectedFile);
    }
  };

  const handleChangeDefaultFile = () => {
    if (isUpdate && updateName) {
      form.setValue(name, undefined);
      setPreviewDefaultFile(undefined);
    }
  };

  const handleRemoveSelectedFile = () => {
    setFile(null);
    setPreviewFile(null);
    form.setValue(isUpdate && updateName ? updateName : name, undefined);
    onChange?.(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (isReset) {
      setPreviewFile(null);
      setFile(null);
      setPreviewDefaultFile(undefined);
    }
  }, [isReset]);

  useEffect(() => {
    setPreviewDefaultFile(defaultFiles);
  }, [defaultFiles]);

  return (
    <div className="w-full space-y-4">
      <FormField
        control={form.control}
        name={isUpdate && updateName ? updateName : name}
        render={() => (
          <FormItem className="w-full">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  id={name}
                  multiple={false}
                  onChange={handleChangeImages}
                  className="hidden"
                />
                <label
                  htmlFor={name}
                  className="flex items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition"
                >
                  <ImagePlus className="w-8 h-8 text-accent" />
                </label>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {previewDefaultFile && (
        <div className="mb-4 flex gap-4 flex-wrap max-h-[500px] overflow-y-auto overflow-x-hidden">
          <PreviewFile
            src={`${imageBaseUrl}/${previewDefaultFile.url}`}
            alt={previewDefaultFile.name}
            type="image"
            action={handleChangeDefaultFile}
          />
        </div>
      )}
      {previewFile && file && (
        <div className="mb-4 flex gap-4 flex-wrap max-h-[500px] overflow-y-auto overflow-x-hidden">
          <PreviewFile
            src={previewFile}
            alt={truncateText(file.name, 15)}
            type="image"
            action={handleRemoveSelectedFile}
          />
        </div>
      )}
    </div>
  );
};
