import GlobalTooltip from "@/components/global/tooltip";
import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import {
  ArrowDownTrayIcon,
  Bars3Icon,
  CodeBracketIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

export default function Header() {
  const {
    editionType,
    setEditionType,
    setVisualizationType,
    visualizationType,
  } = useLandingPageState();

  return (
    <div className="border-b px-4 py-2 z-50 relative flex items-center justify-between overflow-hidden rounded-default">
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

      <Dropdown className="border p-0">
        <DropdownTrigger>
          <Button size="sm" variant="faded" isIconOnly>
            <Bars3Icon className="size-4" />
          </Button>
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
          <DropdownItem
            key="download_zip"
            startContent={<ArrowDownTrayIcon className="size-4" />}
          >
            Download Zip
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
