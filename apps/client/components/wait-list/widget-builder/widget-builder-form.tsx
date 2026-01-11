"use client";

import Title from "@/components/global/title";
import InputComponent from "@/components/ui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import Link from "next/link";

export default function WidgetBuilderForm() {
  return (
    <article className="w-[48rem] mt-6 flex flex-col gap-4">
      {/* General */}
      <section>
        <Card radius="sm" className="border">
          <CardHeader className="border-b">
            <Title description="Configure general information">
              <span className="text-sm">General</span>
            </Title>
          </CardHeader>

          <CardBody className="flex flex-col gap-4">
            <div className="gap-8 grid grid-cols-3">
              {/* <div className="flex flex-col gap-2.5">
              Title
              <InputComponent size="sm" defaultValue="Sign up first-wait-list" />
            </div> */}

              <div className="flex flex-col gap-2.5">
                Email placeholder
                <InputComponent size="sm" defaultValue="Sign up first-wait-list" />
              </div>

              <div className="flex flex-col gap-2.5">
                Text button
                <InputComponent size="sm" defaultValue="Sign up first-wait-list" />
              </div>
            </div>

            {/* <hr />

          <div className="flex flex-col gap-4">
            <Title description="Enabled when user has been registered">
              <span className="text-sm">Success descriptions</span>
            </Title>

            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2.5">
                Success Title
                <InputComponent size="sm" defaultValue="Sign up first-wait-list" />
              </div>

              <div className="flex flex-col gap-2.5">
                Success description
                <InputComponent size="sm" defaultValue="Sign up first-wait-list" />
              </div>
            </div>
          </div> */}
          </CardBody>
        </Card>
      </section>

      {/* Colors */}
      <section>
        <Card radius="sm" className="border">
          <CardHeader className="border-b">
            <Title description="Edit widget colors">
              <span className="text-sm">Colors</span>
            </Title>
          </CardHeader>

          <CardBody className="grid grid-cols-3 gap-8">
            <div className="flex flex-col gap-2.5">
              Button background
              <div className="flex gap-4">
                <label
                  htmlFor="color-input"
                  className="relative border rounded-full !aspect-square"
                >
                  <input type="color" id="color-input" className="scale-0 w-8" />
                </label>

                <InputComponent size="sm" />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              Button text color
              <div className="flex gap-4">
                <label
                  htmlFor="color-input"
                  className="relative border rounded-full !aspect-square"
                >
                  <input type="color" id="color-input" className="scale-0 w-8" />
                </label>

                <InputComponent size="sm" />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              Border input
              <div className="flex gap-4">
                <label
                  htmlFor="color-input"
                  className="relative border rounded-full !aspect-square"
                >
                  <input type="color" id="color-input" className="scale-0 w-8" />
                </label>

                <InputComponent size="sm" />
              </div>
            </div>

            {/* <div className="flex flex-col gap-2.5">
            Text color
            <div className="flex gap-4">
              <label
                htmlFor="color-input"
                className="relative border rounded-full !aspect-square"
              >
                <input type="color" id="color-input" className="scale-0 w-8" />
              </label>

              <InputComponent size="sm" />
            </div>
          </div> */}
          </CardBody>
        </Card>
      </section>

      <div className="flex justify-between">
        <Button variant="flat" size="sm" as={Link} href="/app/waitlist" className="border">
          Cancel
        </Button>

        <div className="flex gap-2">
          <Button size="sm" className="border">
            Create
          </Button>
          <Button size="sm" className="border" color="primary">
            Create and attach
          </Button>
        </div>
      </div>

      {/* <hr /> */}

      {/* Social media section */}
      {/* <section>
      <div className="flex flex-col gap-3">
        <Card radius="sm">
          <CardHeader className="border-b">
            <Title description="Add social media links to your widget">
              <span className="text-sm">Social media links</span>
            </Title>
          </CardHeader>

          <CardBody className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2.5">
                <span className="font-medium">Facebook</span>
                <div className="relative">
                  <InputComponent
                    size="sm"
                    startContent={
                      <span className="text-xs text-muted-foreground">
                        https://facebook.com/
                      </span>
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="font-medium">Instagram</span>
                <div className="relative">
                  <InputComponent
                    size="sm"
                    startContent={
                      <span className="text-xs text-muted-foreground">
                        https://instagram.com/
                      </span>
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="font-medium">Twitter</span>
                <div className="relative">
                  <InputComponent
                    size="sm"
                    startContent={
                      <span className="text-xs text-muted-foreground">
                        https://twitter.com/
                      </span>
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="font-medium">LinkedIn</span>
                <div className="relative">
                  <InputComponent
                    size="sm"
                    startContent={
                      <span className="text-xs text-muted-foreground">
                        https://linkedin.com/
                      </span>
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="font-medium">Pinterest</span>
                <div className="relative">
                  <InputComponent
                    size="sm"
                    startContent={
                      <span className="text-xs text-muted-foreground">
                        https://pinterest.com/
                      </span>
                    }
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </section> */}
    </article>
  );
}
