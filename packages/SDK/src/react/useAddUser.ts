import { useCallback, useEffect, useRef, useState } from "react";

import { ZotSDK } from "../index";
import type { AddUserParams, WaitlistUserResponse, ZotSDKConfig } from "../types";
import { ZotAPIError } from "../types";

const STORAGE_PREFIX = "zot:waitlist:registered:";

const storageKey = (waitlistId: string) => `${STORAGE_PREFIX}${waitlistId}`;

function readRegistered(waitlistId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(storageKey(waitlistId)) === "1";
  } catch {
    return false;
  }
}

function writeRegistered(waitlistId: string, value: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(storageKey(waitlistId), "1");
    else window.localStorage.removeItem(storageKey(waitlistId));
  } catch {
    // ignore quota / privacy-mode errors
  }
}

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

  useEffect(() => {
    setIsUserRegistered(readRegistered(waitlistId));
  }, [waitlistId]);

  const addUser = useCallback(
    async (params: AddUserParams) => {
      setIsPending(true);
      setError(undefined);

      try {
        const user = await sdkRef.current!.waitlist(waitlistId).addUser(params);
        setData(user);
        setIsUserRegistered(true);
        writeRegistered(waitlistId, true);
        onSuccess?.(user);
        return user;
      } catch (err) {
        const normalized = err instanceof Error ? err : new Error(String(err));
        setError(normalized);
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
    writeRegistered(waitlistId, false);
  }, [waitlistId]);

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
