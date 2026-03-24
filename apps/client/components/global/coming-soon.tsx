"use client";

import { useState } from "react";
import Type from "../type";
import InputComponent from "../ui/input";
import PrimaryActionButton from "./primary-action-button";

export default function ComingSoon({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) return;

    setSubmitted(true);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] gap-6 max-w-md mx-auto text-center">
      <div className="flex items-center justify-center size-12 rounded-sm border bg-default-100 text-muted-foreground animate-bounce">
        <Icon size={20} />
      </div>

      <div className="flex flex-col gap-2">
        <Type variant="h4">{title}</Type>
        <Type className="text-muted-foreground text-pretty">{description}</Type>
      </div>

      {submitted ? (
        <Type className="text-success">We'll notify you when this feature is available.</Type>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full gap-2 justify-center">
          <InputComponent
            size="sm"
            type="email"
            placeholder="Enter your email"
            value={email}
            onValueChange={setEmail}
            className="min-w-64 max-w-64"
          />
          <PrimaryActionButton type="submit">Notify me</PrimaryActionButton>
        </form>
      )}
    </div>
  );
}
