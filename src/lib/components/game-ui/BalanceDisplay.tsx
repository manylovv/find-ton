import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { getUser } from "~/lib/server/actions/getUser";
import { queryKeys } from "~/queryKeys";

export const BalanceDisplay = memo(() => {
  const { data: user } = useQuery({
    queryKey: queryKeys.getUser,
    queryFn: getUser,
  });

  const balance = user?.balance;

  return (
    <div className="fixed top-4 left-4 text-base text-white bg-black/50 p-2 rounded-lg z-100">
      Balance: {balance} TON
    </div>
  );
});
