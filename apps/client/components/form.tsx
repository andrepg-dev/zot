import { addToast } from "@heroui/react";
import React, { useEffect } from "react";

export default function Form({
  children,
  error,
  ...props
}: {
  children: React.ReactNode;
  error?: Error | null;
} & React.FormHTMLAttributes<HTMLFormElement>) {
  useEffect(() => {
    if (error != null) {
      addToast({
        title: "Unexpeced error.",
        description: "Please try again or contact us at asponceg@gmail.com",
        color: "danger"
      });
    }
  }, [error]);

  return <form {...props}>{children}</form>;
}
