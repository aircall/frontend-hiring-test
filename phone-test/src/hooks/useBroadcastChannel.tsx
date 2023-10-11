import { useEffect, useMemo } from "react"

export const useBroadcastChannel = (channelName: string, callback: (data: any) => void) => {
  const channel = useMemo(() => new BroadcastChannel(channelName), []);

  useEffect(() => {
    channel.addEventListener('message', (data) => callback(data));
  }, []);

  return { broadcast: (message: any) => channel.postMessage(message) }
}