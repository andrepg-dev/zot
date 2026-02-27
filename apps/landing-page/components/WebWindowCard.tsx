import Image from "next/image";

interface WebWindowCardProps {
  url: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function WebWindowCard({ url, title, description, imageSrc, imageAlt }: WebWindowCardProps) {
  return (
    <div className="overflow-hidden ml-auto w-full h-full rounded rounded-tr-none bg-black/20 backdrop-blur-3xl">
      <header className="relative flex items-center justify-center p-3">
        <div className="absolute left-3 flex gap-1.5">
          <div className="aspect-square h-3 w-3 bg-muted-foreground border rounded-full" />
          <div className="aspect-square h-3 w-3 bg-muted-foreground border rounded-full" />
          <div className="aspect-square h-3 w-3 bg-muted-foreground border rounded-full" />
        </div>

        <div className="border rounded bg-muted-foreground/30 text-muted-foreground px-4 text-xs">
          {url}
        </div>
      </header>

      <div className="mx-1.5 sm:mx-2 mb-3 sm:mb-4 border rounded-lg overflow-hidden h-[90%] bg-black/10 flex flex-col justify-center">
        {imageSrc ? (
          <div className="relative w-full h-full">
            <Image
              src={imageSrc}
              alt={imageAlt ?? title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 700px, 100vw"
              priority
            />
          </div>
        ) : (
          <div className="px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
            <div className="max-w-[36ch]">
              <h3 className="text-base sm:text-lg lg:text-xl font-medium mb-1 sm:mb-2">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

