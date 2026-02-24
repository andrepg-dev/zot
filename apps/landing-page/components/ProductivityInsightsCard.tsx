import { WaterfallUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";

export interface ProductivityInsightsCardProps {
  /** Imagen de la vista previa en la ventana lateral derecha */
  previewImage: {
    src: string;
    alt?: string;
  };
  /** Texto de la barra de URL (ej. "zot.so") */
  previewUrl?: string;
}

export default function ProductivityInsightsCard({
  previewImage,
  previewUrl = "zot.so",
}: ProductivityInsightsCardProps) {
  return (
    <div
      className="border border-white/10 rounded-xl rounded-br-none rounded-tl-none overflow-hidden aspect-square min-h-[300px] sm:min-h-0"
      style={{
        background:
          "radial-gradient(ellipse 80% 80% at 50% 40%, rgba(82, 39, 255, 0.35) 0%, rgba(82, 39, 255, 0.12) 35%, transparent 70%), #000000",
      }}
    >
      <div className="p-6 sm:p-8 lg:p-12">
        <div className="flex flex-col gap-3 sm:gap-4">
          <HugeiconsIcon icon={WaterfallUp01Icon} strokeWidth={2} className="size-7" />
          <h3 className="text-2xl sm:text-3xl">Productivity insights</h3>
          <h4 className="text-muted-foreground max-w-[40ch] text-sm sm:text-base">
            Get detailed reports on your productivity. Identify patterns,
            understand your habits, and make informed decisions to improve your
            workflow.
          </h4>
        </div>
      </div>

      <div className="border-t border-l ml-auto w-5/6 h-full rounded-lg rounded-tr-none bg-black/20 backdrop-blur-3xl">
        <header className="flex p-2 sm:p-3 gap-1.5 items-center">
          <div className="flex gap-1.5 mt-1 shrink-0">
            <div className="aspect-square h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500 border rounded-full"></div>
            <div className="aspect-square h-2.5 w-2.5 sm:h-3 sm:w-3 bg-yellow-500 border rounded-full"></div>
            <div className="aspect-square h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500 border rounded-full"></div>
          </div>

          <div className="border rounded bg-muted-foreground/30 text-muted-foreground px-2 sm:px-4 text-[10px] sm:text-xs ml-auto mr-4 sm:mr-8 md:mr-32 truncate min-w-0 max-w-[50%] sm:max-w-none">
            {previewUrl}
          </div>
        </header>

        <div className="mx-2 mr-0 border-t rounded-lg rounded-tr-none overflow-hidden bg-black/10 min-h-[200px] sm:min-h-[280px] lg:min-h-[320px]">
          <Image
            src={previewImage.src}
            width={800}
            height={800}
            alt={previewImage.alt ?? "Vista previa"}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
