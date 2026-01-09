import Title from "@/components/global/title";
import GlobalTooltip from "@/components/global/tooltip";
import PageComponent from "@/components/layouts/page-component";
import WidgetBuilderForm from "@/components/wait-list/widget-builder/widget-builder-form";
import { cn } from "@/lib/utils";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const from = params?.from;

  return (
    <div className="flex h-full">
      <PageComponent className="border-r h-full">
        <Title description="Build and customize your widget">Widget Builder</Title>
        <WidgetBuilderForm />
      </PageComponent>
      <div className="border-b p-2 px-6 h-max w-full">
        <div className="border rounded-md w-max flex bg-default-100 overflow-hidden text-xs">
          <GlobalTooltip content="Vista previa web">
            <button className={cn("p-1 px-2 rounded !cursor-pointer text-xs bg-default-50")}>
              <EyeIcon className="size-4" />
            </button>
          </GlobalTooltip>
          <GlobalTooltip content="Vista de código">
            <button className={cn("p-1 px-2 rounded !cursor-pointer text-xs")}>
              <CodeBracketIcon className="size-4" />
            </button>
          </GlobalTooltip>
        </div>
      </div>

      
    </div>
  );
}
