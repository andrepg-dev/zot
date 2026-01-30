import GlobalButton from "@/components/global/button";
import PrimaryActionButton from "@/components/global/primary-action-button";
import GlobalTooltip from "@/components/global/tooltip";
import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import {
  ArrowDownTrayIcon,
  Bars3Icon,
  CodeBracketIcon,
  EyeIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import MonacoEditorTemplate from "./monaco-edito-header-template";

export default function MonacoEditorHeader() {
  const { editionType, setEditionType, setVisualizationType, visualizationType } =
    useLandingPageState();

  return (
    <MonacoEditorTemplate>
      <div className="flex text-xs items-center gap-2">
        <span>Edition type:</span>

        <div className="border rounded-md w-max flex bg-default-100 overflow-hidden text-xs">
          <GlobalTooltip content="Editar usando inteligencia artificial">
            <button
              onClick={() => setEditionType("ai")}
              className={cn(
                "p-1 px-2 rounded !cursor-pointer text-xs",
                editionType === "ai" && "bg-default-50"
              )}
            >
              AI
            </button>
          </GlobalTooltip>
          <GlobalTooltip content="Editar manualmente">
            <button
              onClick={() => setEditionType("manually")}
              className={cn(
                "p-1 px-2 rounded !cursor-pointer text-xs",
                editionType === "manually" && "bg-default-50"
              )}
            >
              Manually
            </button>
          </GlobalTooltip>
        </div>
      </div>
      <div className="border rounded-md w-max flex bg-default-100 overflow-hidden text-xs mr-14">
        <GlobalTooltip content="Vista previa web">
          <button
            onClick={() => setVisualizationType("web")}
            className={cn(
              "p-1 px-2 rounded !cursor-pointer text-xs",
              visualizationType === "web" && "bg-default-50"
            )}
          >
            <EyeIcon className="size-4" />
          </button>
        </GlobalTooltip>
        <GlobalTooltip content="Vista de código">
          <button
            onClick={() => setVisualizationType("code")}
            className={cn(
              "p-1 px-2 rounded !cursor-pointer text-xs",
              visualizationType === "code" && "bg-default-50"
            )}
          >
            <CodeBracketIcon className="size-4" />
          </button>
        </GlobalTooltip>
      </div>

      <div className="flex gap-2 items-center">
        <PrimaryActionButton startContent={<RocketLaunchIcon className="size-4" strokeWidth={2} />}>Launch product</PrimaryActionButton>


        <Dropdown className="border p-0" disableAnimation>
          <DropdownTrigger>
            <GlobalButton size="sm" variant="faded" isIconOnly disableRipple>
              <Bars3Icon className="size-4" />
            </GlobalButton>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Menu de acciones"
            variant="flat"
            onAction={(key) => {
              if (key === "download_zip") {
                // Aquí puedes agregar la lógica para descargar el ZIP
                console.log("Download Zip");
              }
            }}
          >
            <DropdownItem key="download_zip" startContent={<ArrowDownTrayIcon className="size-4" />}>
              Download code
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </MonacoEditorTemplate>
  );
}
