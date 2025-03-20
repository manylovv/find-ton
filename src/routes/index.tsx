import { createFileRoute } from "@tanstack/react-router";
import Home from "~/lib/components/game-ui/Home";

export const Route = createFileRoute("/")({
  component: Home,
  ssr: false,
});
