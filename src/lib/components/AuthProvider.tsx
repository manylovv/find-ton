import { useMutation } from "@tanstack/react-query";
import { retrieveRawInitData } from "@telegram-apps/bridge";
import { useEffect, useState } from "react";
import { login } from "../server/actions/login";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setLoggedIn(true);
      console.log("ye all good bitch", data);
    },
  });
  useEffect(() => {
    const initData = retrieveRawInitData();
    if (!initData) {
      return;
    }
    console.log("init data", initData);
    loginMutation.mutate({ data: { initData } });
  }, []);

  console.log("logged in", loggedIn);

  if (!loggedIn) {
    return null;
  }

  return <>{children}</>;
};
