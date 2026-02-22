"use client";

import { useEffect } from "react";
import { useChatSidebar } from "./context";

export const ChatSidebarTrigger = () => {
  const { toggleSidebar } = useChatSidebar();

  useEffect(() => {
    const button = document.getElementById(
      "chat-sidebar-trigger",
    ) as HTMLButtonElement | null;
    if (!button) return;

    button.addEventListener("click", toggleSidebar);
    button.disabled = false;

    return () => {
      button.removeEventListener("click", toggleSidebar);
      button.disabled = true;
    };
  }, [toggleSidebar]);

  return null;
};
