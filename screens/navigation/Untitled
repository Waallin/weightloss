import { useEffect } from "react";
import { AppState } from "react-native";

export const useSyncToday = (user: any, syncToday: (uid: string) => Promise<void>) => {
  
  // Kör när user laddas
  useEffect(() => {
    if (!user?.id) return;

    syncToday(user.id);
  }, [user?.id]);

  // Kör när appen blir aktiv igen
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && user?.id) {
        syncToday(user.id);
      }
    });

    return () => sub.remove();
  }, [user?.id]);
};