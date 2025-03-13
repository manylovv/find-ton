import Home from "@/components/Home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Home,
});
