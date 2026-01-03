"use client";

import Type from "@/components/type";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import Image from "next/image";
import Link from "next/link";

interface LandingPageCardProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  views: string;
  href: string;
  onPress?: () => void;
}

export default function LandingPageCard({
  imageSrc,
  imageAlt = "",
  title,
  views,
  href,
}: LandingPageCardProps) {
  return (
    <Card
      className="flex flex-col items-center rounded-default overflow-hidden cursor-pointer"
      isPressable
      isBlurred
      as={Link}
      href={href}
    >
      <CardBody className="p-0">
        <div className="overflow-hidden rounded-default">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={700}
            height={700}
            className="w-full rounded-default group-hover:scale-[1.01] transition"
          />
        </div>
      </CardBody>
      <CardFooter className="flex flex-col mt-1.5">
        <Tooltip content={`Haz clic para editar: ${title}`}>
          <Type className="font-light">{title}</Type>
        </Tooltip>
        <Tooltip content={`Total de visualizaciones: ${views}`}>
          <Type className="text-muted-foreground font-light">{views}</Type>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
