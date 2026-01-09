"use client";

import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import { ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function EditorSidebar() {
  const { editionType } = useLandingPageState();

  return (
    <SidebarNavigation
      className={cn(
        "overflow-y-auto z-50 duration-400 transition-all",
        editionType === "ai" ? "min-w-[435px]" : "min-w-0 w-0"
      )}
      children={
        <div className="p-4 pb-0 flex flex-col h-full flex-1 text-sm gap-2 min-w-[435px]">
          <div className="flex flex-col gap-2.5 flex-1 min-h-0 pb-52">
            <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto">
              Hola, estoy creando una tienda online para vender ropa y necesito ayuda.
            </div>

            <div className="p-2 rounded-lg max-w-4/5">
              ¡Perfecto! ¿Qué tipo de ropa quieres vender y a qué tipo de público?
            </div>

            <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto">
              Principalmente camisetas y hoodies. Quiero vender a jóvenes de 16 a 25 años.
            </div>

            <div className="p-2 rounded-lg max-w-4/5">
              Excelente. ¿Tu marca tiene un estilo más urbano, minimalista o deportivo?
            </div>

            <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto">
              Urbano y minimalista, con frases cortas y diseños limpios.
            </div>

            <div className="p-2 rounded-lg max-w-4/5">
              Perfecto. Puedo ayudarte a definir tu identidad, precios, catálogo inicial y
              estrategia de venta. ¿Ya tienes nombre de marca?
            </div>

            <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto">
              Sí, se llama Trayecto.
            </div>

            <div className="p-2 rounded-lg max-w-4/5">
              Me encanta el nombre. Vamos a construir tu tienda paso a paso. ¿Quieres empezar por
              logo, catálogo o precios?
            </div>

            <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto">
              Me gustaría comenzar por los precios y el primer catálogo.
            </div>
          </div>

          <footer className="bg-sidebar flex-shrink-0 sticky bottom-0 shadow-[0_-2px_10px_rgba(0,0,0,0.80)]">
            <div className="bg-default-50 mb-4 rounded-lg border">
              <textarea
                className="w-full p-4 text-sm resize-none outline-none"
                placeholder="Escribe tu mensaje aquí..."
              />

              <div className="flex px-3 pb-2 pt-1 items-center justify-between">
                <button className="p-1.5 rounded-full cursor-pointer hover:ring-2 ring-default/30">
                  <PlusIcon className="size-4" />
                </button>

                <button
                  disabled
                  className="disabled:opacity-60 bg-primary p-1.5 rounded-full cursor-pointer hover:ring-2 ring-primary/30"
                >
                  <ChevronRightIcon className="size-4" />
                </button>
              </div>
            </div>
          </footer>
        </div>
      }
    />
  );
}
