import { PureSidebarProvider, useSidebar } from "@/components/ui/sidebar";

const CHAT_SIDEBAR_COOKIE_NAME = "chat_sidebar_state";

const useChatSidebar = useSidebar;

function ChatSidebarProvider(
  props:  React.PropsWithChildren<{
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }>,
) {
  return <PureSidebarProvider {...props} COOKIE_NAME={CHAT_SIDEBAR_COOKIE_NAME} />;
}

export { useChatSidebar, ChatSidebarProvider };
