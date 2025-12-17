"use client";

import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import { ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function NewLandingPage() {
  return (
    <PageComponent>
      <HeaderNavigation
        navigationItems={[
          { label: "Landing Page", pathname: "/app/landing-page" },
          { label: "Create", pathname: "" },
        ]}
      />

      {/* <SidebarNavigation hidden navItems={defaultNavItems} /> */}

      <SidebarNavigation
        className="w-[600px] h-full overflow-y-auto"
        children={
          <div className="p-4 pb-4 flex flex-col h-full flex-1 text-sm gap-2 w-[425px]">
            <div className="flex flex-col gap-2.5 bg-red-950 overflow-y-scroll flex-1 min-h-0">
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

            <footer className="bg-default-100 rounded-lg border min-h-32 flex-shrink-0">
              <textarea
                className="w-full p-4 text-sm resize-none outline-none min-h-20"
                placeholder="Describe your business here"
              />

              <div className="flex px-2 pb-2 pt-1 items-center justify-between">
                <button className="bg-default p-1.5 rounded-full cursor-pointer hover:ring-2 ring-default/30">
                  <PlusIcon className="size-4" />
                </button>

                <button className="bg-default hover:bg-primary p-1.5 rounded-full cursor-pointer hover:ring-2 ring-primary/30">
                  <ChevronRightIcon className="size-4" />
                </button>
              </div>
            </footer>
          </div>
        }
      />
    </PageComponent>
  );
}
