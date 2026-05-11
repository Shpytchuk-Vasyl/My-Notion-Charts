"use client";

import { useParams } from "next/navigation";
import { SuspenseSkeleton } from "@/components/ui/skeleton-suspense";
import type { Chart } from "@/models/chart";
import { DefaultDialog } from "@/components/ui/modal";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { CopyIcon, Share2Icon } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { updateChartPublicStatus } from "@/app/[locale]/(protected)/(general)/dashboard/actions";
import { debounce } from "@/helpers/debounce";

type ShareChartFormProps = {
  translation: {
    title: string;
    description: string;
    link: string;
    linkCopied: string;
    copy: string;
    share: string;
    makePublicLabel: string;
    makePublicDescription: string;
    embed: string;
  };
  isIntercepted?: boolean;
  chart: Promise<Pick<Chart, "name" | "is_public" | "config">>;
};

export function ShareChartForm({
  translation,
  isIntercepted = false,
  chart,
}: ShareChartFormProps) {
  const [isPublic, setIsPublic] = useState<boolean | null>(null);
  const [ttl, setTtl] = useState(0);
  const [allowUpdate, setAllowUpdate] = useState(false);
  const { id } = useParams();
  const { copyToClipboard } = useCopyToClipboard();

  const shareData: ShareData = {
    title: translation.title,
    url: `${window.location.origin}/chart/${id}/view${isPublic ? `/open${ttl ? "/" + ttl : ""}` : ""}`,
  };

  const embedCode = [
    "<iframe",
    '  width="100%"',
    '  height="400"',
    `  src="${shareData.url}"`,
    '  frameborder="0"',
    "  allowfullscreen",
    "></iframe>",
  ].join("\n");

  useEffect(() => {
    chart.then((data) => {
      setIsPublic(data.is_public);
      setTtl(data.config.cache.duration);
    });
  }, [chart]);

  const updatePublicStatus = debounce((newStatus: boolean) => {
    updateChartPublicStatus({
      id: id as string,
      is_public: newStatus,
    } as Chart).then((result) => {
      if (!result.success) {
        toast.error(result.msg);
        setIsPublic(() => !newStatus);
      }
    });
  }, 2000);

  useEffect(() => {
    if (isPublic === null) return;
    setAllowUpdate(true);
    if (!allowUpdate) return;
    updatePublicStatus(isPublic);
  }, [isPublic]);

  return (
    <DefaultDialog isIntercepted={isIntercepted} backPath={`/chart/${id}`}>
      <DialogHeader>
        <DialogTitle>
          {translation.title}: {<Name chart={chart} />}
        </DialogTitle>
        <DialogDescription
          {...(isPublic ? {} : { "data-hidden": true })}
          className="data-hidden:max-h-0 max-h-dvh overflow-hidden transition-[max-height]"
        >
          {translation.description}
        </DialogDescription>
      </DialogHeader>

      <FieldSet disabled={isPublic === null}>
        <Field>
          <FieldLabel htmlFor="link">{translation.link}</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="link"
              value={shareData.url}
              readOnly
              placeholder={translation.link}
            />

            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label={translation.copy}
                title={translation.copy}
                size="icon-sm"
                onClick={() => {
                  copyToClipboard(shareData.url!).then((success) => {
                    if (success) {
                      toast.success(translation.linkCopied);
                    }
                  });
                }}
              >
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>

            {typeof navigator.canShare === "function" &&
              navigator.canShare(shareData) && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label={translation.share}
                    title={translation.share}
                    size="icon-sm"
                    onClick={() => {
                      navigator.share(shareData);
                    }}
                  >
                    <Share2Icon />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
          </InputGroup>
        </Field>

        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="switch">
              {translation.makePublicLabel}
            </FieldLabel>
            <FieldDescription>
              {translation.makePublicDescription}
            </FieldDescription>
          </FieldContent>
          <Switch
            id="switch"
            checked={isPublic!}
            onCheckedChange={setIsPublic}
          />
        </Field>

        <Field
          {...(isPublic ? {} : { "data-hidden": true })}
          className="data-hidden:max-h-0 max-h-dvh overflow-hidden transition-[max-height] delay-500"
        >
          <FieldLabel htmlFor="iframe">{translation.embed}</FieldLabel>
          <InputGroup className="items-start">
            <InputGroupTextarea
              readOnly
              id="iframe"
              value={embedCode}
              placeholder={translation.embed}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label={translation.copy}
                title={translation.copy}
                size="icon-sm"
                onClick={() => {
                  copyToClipboard(embedCode).then((success) => {
                    if (success) {
                      toast.success(translation.linkCopied);
                    }
                  });
                }}
              >
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldSet>
    </DefaultDialog>
  );
}

const Name = ({ chart }: { chart: ShareChartFormProps["chart"] }) => {
  return (
    <SuspenseSkeleton
      promise={chart}
      className="w-40 h-full inline-block"
      afterKey="name"
    />
  );
};
