"use client";

import Header from "@/components/app/landing-page/header";
import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import {
  ChevronRightIcon,
  PaintBrushIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import React from "react";

export default function EditLandingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  return (
    <PageComponent className="flex flex-1 h-full p-0">
      <HeaderNavigation
        navigationItems={[
          { label: "Landing Page", pathname: "/app/landing-page" },
          { label: id, pathname: id },
        ]}
      />
      <SidebarNavigation
        className="w-[620px] overflow-y-auto z-50"
        children={
          <div className="p-4 pb-0 flex flex-col h-full flex-1 text-sm gap-2 w-[435px]">
            <div className="flex flex-col gap-2.5 flex-1 min-h-0 pb-52">
              <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>
              <div className="p-2 rounded-lg max-w-4/5">Hola</div>
              <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>
              <div className="p-2 rounded-lg max-w-4/5">Hola</div>
              <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>
              <div className="p-2 rounded-lg max-w-4/5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>

              <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>
              <div className="p-2 rounded-lg max-w-4/5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>

              <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>
            </div>

            <footer className="bg-sidebar flex-shrink-0 sticky bottom-0 shadow-[0_-2px_10px_rgba(0,0,0,0.80)]">
              <div className="bg-default-50 mb-4 rounded-lg border">
                <textarea
                  className="w-full p-4 text-sm resize-none outline-none "
                  placeholder="Describe your business here"
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

      <div className="h-full flex-1 w-full relative">
        <Header />

        <div className="flex flex-col text-muted-foreground absolute w-full h-full justify-center items-center gap-2 bottom-0 -z-0 bg-default-50">
          <PaintBrushIcon className="size-5" />

          <footer className="absolute bottom-4 mx-auto flex gap-4 text-muted-foreground/40">
            Let's explore
          </footer>
        </div>
      </div>
    </PageComponent>
  );
}
