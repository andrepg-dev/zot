import { useCallback, useRef, useState } from "react";

import { ZotSDK } from "../index";
import type { AddUserParams, WaitlistUserResponse, ZotSDKConfig } from "../types";
import { ZotAPIError } from "../types";

export interface UseAddUserOptions extends ZotSDKConfig {
  waitlistId: string;
  onSuccess?: (user: WaitlistUserResponse) => void;
  onError?: (error: ZotAPIError | Error) => void;
}

export interface UseAddUserResult {
  addUser: (params: AddUserParams) => Promise<WaitlistUserResponse | undefined>;
  data: WaitlistUserResponse | undefined;
  error: ZotAPIError | Error | undefined;
  isPending: boolean;
  isUserRegistered: boolean;
  isError: boolean;
  reset: () => void;
}

export function useAddUser(options: UseAddUserOptions): UseAddUserResult {
  const { waitlistId, apiKey, baseUrl, onSuccess, onError } = options;

  const sdkRef = useRef<ZotSDK | null>(null);
  if (!sdkRef.current) {
    sdkRef.current = new ZotSDK({ apiKey, baseUrl });
  }

  const [data, setData] = useState<WaitlistUserResponse | undefined>(undefined);
  const [error, setError] = useState<ZotAPIError | Error | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  const addUser = useCallback(
    async (params: AddUserParams) => {
      setIsPending(true);
      setError(undefined);

      try {
        const user = await sdkRef.current!.waitlist(waitlistId).addUser(params);
        setData(user);
        setIsUserRegistered(true);
        onSuccess?.(user);
        return user;
      } catch (err) {
        const normalized = err instanceof Error ? err : new Error(String(err));
        setError(normalized);
        setIsUserRegistered(false);
        onError?.(normalized);
        return undefined;
      } finally {
        setIsPending(false);
      }
    },
    [waitlistId, onSuccess, onError],
  );

  const reset = useCallback(() => {
    setData(undefined);
    setError(undefined);
    setIsPending(false);
    setIsUserRegistered(false);
  }, []);

  return {
    addUser,
    data,
    error,
    isPending,
    isUserRegistered,
    isError: error !== undefined,
    reset,
  };
}
