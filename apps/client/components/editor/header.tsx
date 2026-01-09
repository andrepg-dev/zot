"use client";

import HeaderNavigation from "@/components/navigation/header.navigation";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";

export default function EditorHeader({ id }: { id: string }) {
  const [shouldChangeHeader, setShouldChangeHeader] = useState<boolean>();
  const { editionType, setVisualizationType } = useLandingPageState();

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setShouldChangeHeader(editionType === "manually");
      setVisualizationType(editionType === "ai" ? "code" : "web");
    }, 500);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [editionType]);

  return (
    <HeaderNavigation
      navigationItems={[
        { label: "Landing Page", pathname: "/app/landing-page" },
        { label: id, pathname: id }
      ]}
      postNavigationItems={
        <div>
          <Button size="sm" className="px-3 py-2 bg-foreground text-white dark:text-black h-max">
            Launch
          </Button>
        </div>
      }
      hidden={shouldChangeHeader}
    />
  );
}
