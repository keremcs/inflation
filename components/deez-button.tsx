"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function DeezButton({ val }: { val: number }) {
  const { pending } = useFormStatus();
  return pending ? (
    <Button disabled>{val} GL</Button>
  ) : (
    <Button type="submit" name="bid" value={val}>
      {val} GL
    </Button>
  );
}
