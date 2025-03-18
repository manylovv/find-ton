import { createFileRoute } from "@tanstack/react-router";
import Home from "~/lib/components/game/Home";

export const Route = createFileRoute("/")({
  component: Home,

});
