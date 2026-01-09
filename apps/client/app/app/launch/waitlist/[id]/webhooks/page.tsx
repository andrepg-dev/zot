import FormField from "@/components/form-field";
import Title from "@/components/global/title";
import PageComponent from "@/components/layouts/page-component";
import InputComponent from "@/components/ui/input";
import { LinkIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Card, CardFooter } from "@heroui/card";

export default function Webhooks() {
  return (
    <PageComponent className="flex flex-col gap-6">
      <Title description="Receive notification when a user has been registered">Webhooks</Title>

      <div className="flex flex-col gap-4">
        <Card radius="sm">
          <FormField
            icon={<LinkIcon className="size-4" />}
            title="Webhook URL"
            description="Automatically send webhook callbacks for user signup and offboarding events."
            className="p-4"
          >
            <InputComponent type="url" />
          </FormField>
          <hr />
          <CardFooter className="flex justify-end">
            <Button color="primary" size="sm">
              Connect
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageComponent>
  );
}
