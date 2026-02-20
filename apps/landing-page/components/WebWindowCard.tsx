interface WebWindowCardProps {
  url: string;
  title: string;
  description: string;
}

export default function WebWindowCard({ url, title, description }: WebWindowCardProps) {
  return (
    <div className="overflow-hidden ml-auto w-full h-full rounded-lg rounded-tr-none bg-black/20 backdrop-blur-3xl">
      <header className="flex p-3 gap-1.5">
        <div className="flex gap-1.5 mt-1">
          <div className="aspect-square h-3 w-3 bg-muted-foreground border rounded-full" />
          <div className="aspect-square h-3 w-3 bg-muted-foreground border rounded-full" />
          <div className="aspect-square h-3 w-3 bg-muted-foreground border rounded-full" />
        </div>

        <div className="border rounded bg-muted-foreground/30 text-muted-foreground px-4 text-xs ml-auto mr-32">
          {url}
        </div>
      </header>

      <div className="mx-2 mb-4 border rounded-lg overflow-hidden h-[90%] bg-black/10 flex flex-col justify-center px-8">
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-[36ch]">{description}</p>
      </div>
    </div>
  );
}

