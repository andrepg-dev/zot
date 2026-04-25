"use client";

import { submitFeedback } from "@/actions/feedback/feedback.actions";
import { cn } from "@/lib/utils";
import useHeaderStore from "@/store/header/header.store";
import { MagnifyingGlassIcon, PhotoIcon, SlashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import GlobalButton from "../global/button";
import GlobalTextarea from "../global/Textarea";

const MAX_FEEDBACK_IMAGES = 5;
const MAX_FEEDBACK_IMAGE_SIZE = 5 * 1024 * 1024;

export default function Header() {
  const { children, navigationItems, postNavigationItems, hidden } = useHeaderStore();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previews = images.map((file) => ({
    file,
    url: URL.createObjectURL(file)
  }));

  const reset = () => {
    setMessage("");
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("message", message);
      images.forEach((file) => formData.append("images", file));
      return await submitFeedback(formData);
    },
    onSuccess: () => {
      addToast({
        title: "Feedback sent",
        description: "Thanks for helping us improve zot.",
        color: "success"
      });
      reset();
      setFeedbackOpen(false);
    },
    onError: (err) => {
      addToast({
        title: "Error",
        description: err.message,
        color: "danger"
      });
    }
  });

  const addFiles = (files: File[]) => {
    const accepted: File[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_FEEDBACK_IMAGE_SIZE) {
        addToast({
          title: "Image too large",
          description: `${file.name} exceeds the 5MB limit.`,
          color: "danger"
        });
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length === 0) return;
    setImages((prev) => [...prev, ...accepted].slice(0, MAX_FEEDBACK_IMAGES));
  };

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const pasted: File[] = [];
    for (const item of items) {
      if (item.kind !== "file") continue;
      const file = item.getAsFile();
      if (!file || !file.type.startsWith("image/")) continue;

      const ext = file.type.split("/")[1] ?? "png";
      const named = file.name
        ? file
        : new File([file], `pasted-${Date.now()}.${ext}`, { type: file.type });
      pasted.push(named);
    }

    if (pasted.length === 0) return;
    e.preventDefault();
    addFiles(pasted);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = () => {
    if (!message.trim() || isPending) return;
    mutate();
  };

  return (
    <header
      className={cn("overflow-hidden transition-all duration-700", hidden ? "h-2" : "h-12")}
      id="header"
    >
      <div className="shrink-0 bg-sidebar p-4 flex items-center justify-between overflow-hidden h-12">
        <div className="flex gap-2 items-center">
          <Link href={"/app/dashboard"}>
            <span className="font-bold text-2xl">zot</span>
          </Link>

          {navigationItems &&
            navigationItems?.map((value, idx) => (
              <div
                key={idx}
                className="flex items-center text-sm font-semibold gap-2 mt-1 text-muted-foreground hover:text-foreground"
              >
                <span className="text-muted-foreground">
                  <SlashIcon className="size-4 text-default-100" />
                </span>

                <Link
                  href={value.pathname}
                  className="hover:underline-2 hover:underline decoration-2 rounded-md !text-[13px] max-w-[16ch] truncate"
                >
                  {value.label}
                </Link>
              </div>
            ))}

          <div>{children}</div>
        </div>

        {postNavigationItems ? (
          postNavigationItems
        ) : (
          <div className="flex items-center gap-4">
            <Button
              startContent={<MagnifyingGlassIcon className={"size-4"} />}
              radius="full"
              variant="bordered"
              className="text-muted-foreground text-xs flex hover:border-muted"
              size="sm"
            >
              <span>Search...</span>

              <Kbd keys={["command"]} className="scale-95 bg-transparent text-muted-foreground">
                k
              </Kbd>
            </Button>

            <Popover
              radius="sm"
              placement="bottom-end"
              isOpen={feedbackOpen}
              onOpenChange={(open) => {
                setFeedbackOpen(open);
                if (!open) reset();
              }}
            >
              <PopoverTrigger>
                <GlobalButton variant="light" className="text-xs text-muted-foreground">
                  Feedback
                </GlobalButton>
              </PopoverTrigger>

              <PopoverContent className="p-2 flex flex-col gap-2 items-stretch">
                <GlobalTextarea
                  size="sm"
                  className="min-w-[300px]"
                  placeholder="My idea to improve zot is"
                  variant="faded"
                  value={message}
                  onValueChange={setMessage}
                  onPaste={onPaste}
                  isDisabled={isPending}
                />

                {previews.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-start w-full">
                    {previews.map((preview, idx) => (
                      <div
                        key={preview.url}
                        className="relative size-14 rounded-sm overflow-hidden border"
                      >
                        <Image
                          src={preview.url}
                          alt={preview.file.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5 hover:bg-background"
                          aria-label="Remove image"
                        >
                          <XMarkIcon className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={onSelectFiles}
                />

                <div className="bg-border w-full h-[1px]"></div>

                <div className="flex justify-end gap-2 w-full">
                  <GlobalButton
                    isIconOnly
                    variant="faded"
                    onPress={() => fileInputRef.current?.click()}
                    isDisabled={isPending || images.length >= MAX_FEEDBACK_IMAGES}
                  >
                    <PhotoIcon className="size-4" />
                  </GlobalButton>
                  <GlobalButton
                    color="primary"
                    onPress={onSubmit}
                    isLoading={isPending}
                    isDisabled={!message.trim() || isPending}
                  >
                    Send feedback
                  </GlobalButton>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </header>
  );
}
