import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBalance } from "~/lib/server/actions/updateUserBalance";
import { queryKeys } from "~/queryKeys";

export const useBalanceUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.getUser });
    },
  });
};
