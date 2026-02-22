"use client";

type UseCopyToClipboardResult = {
  copyToClipboard: (text: string) => Promise<boolean>;
};

export function useCopyToClipboard(): UseCopyToClipboardResult {
  const copyToClipboard = async (text: string) => {
    if (!text) {
      return false;
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      return true;
    } catch {
      return false;
    }
  };

  return {
    copyToClipboard,
  };
}
