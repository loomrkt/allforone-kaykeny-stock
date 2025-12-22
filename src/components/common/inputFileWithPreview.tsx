import { Media } from "@/interfaces/common";
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
  defaultFiles?: Media[];
  isReset?: boolean;
}

export const InputFileWithPreview = ({
  name,
  form,
  label,
  isUpdate,
  updateName,
  defaultFiles,
  isReset,
}: InputFileWithPreviewProps) => {
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<string[]>([]);
  const [previewDefaultFiles, setPreviewDefaultFiles] = useState<
    Media[] | undefined
  >(defaultFiles);
  const [file, setFile] = useState<File[]>([]);

  const handleChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    const updatedFiles = [...file, ...selectedFiles];
    form.setValue(isUpdate && updateName ? updateName : name, updatedFiles);
    setFile(updatedFiles);
    setPreviewFile([
      ...previewFile,
      ...selectedFiles.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleChangeDefaultFile = (index: number) => {
    if (isUpdate && updateName) {
      const files = previewDefaultFiles?.filter((_, i) => i !== index) ?? [];
      form.setValue(name, files);
      setPreviewDefaultFiles(files);
    }
  };

  const handleRemoveSelectedFile = (index: number) => {
    const updatedFiles = file.filter((_, i) => i !== index);
    const updatedPreviewFiles = previewFile.filter((_, i) => i !== index);

    setFile(updatedFiles);
    setPreviewFile(updatedPreviewFiles);
    form.setValue(isUpdate && updateName ? updateName : name, updatedFiles);
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };
  useEffect(() => {
    if (isReset) {
      setPreviewFile([]);
    }
  }, [isReset]);

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
                  multiple
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
      {previewDefaultFiles && previewDefaultFiles.length > 0 && (
        <div className="mb-4 flex gap-4 flex-wrap max-h-[500px] overflow-y-auto overflow-x-hidden">
          {previewDefaultFiles.map((preview, index) => (
            <PreviewFile
              key={index}
              src={`${imageBaseUrl}/${preview.url}`}
              alt={preview.name}
              type={preview.extension ?? "image"}
              action={() => handleChangeDefaultFile(index)}
            />
          ))}
        </div>
      )}
      {previewFile.length > 0 && (
        <div className="mb-4 flex gap-4 flex-wrap max-h-[500px] overflow-y-auto overflow-x-hidden">
          {previewFile.map((preview, index) => (
            <PreviewFile
              key={index}
              src={preview}
              alt={truncateText(file[index].name, 15)}
              type={file[index].type.includes("image") ? "image" : undefined}
              action={() => handleRemoveSelectedFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
