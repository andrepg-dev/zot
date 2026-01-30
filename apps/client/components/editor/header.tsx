// [!] unused code - editor header

"use client";

import PrimaryActionButton from "@/components/global/primary-action-button";
import HeaderNavigation from "@/components/navigation/header.navigation";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
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
        <PrimaryActionButton startContent={<RocketLaunchIcon className="size-4" strokeWidth={2} />}>Launch product</PrimaryActionButton>
      }
      hidden={shouldChangeHeader}
    />
  );
}
