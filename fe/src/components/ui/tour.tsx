"use client";

import type { Popover as PopoverPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Popover, PopoverAnchor, PopoverContent } from "./popover";
import { ToorHelper } from "@/helpers/toors";

const TourContext = createContext<{
  start: (tourId: string) => void;
  close: () => void;
} | null>(null);

function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}

type TourDragAnimationProps = {
  fromSelector: string;
  toSelector: string;
  duration?: number;
  onNext: () => void;
};

type BaseStep = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  nextRoute?: string;
  previousRoute?: string;
  nextLabel?: React.ReactNode;
  previousLabel?: React.ReactNode;
  side?: PopoverPrimitive.PopoverContentProps["side"];
  sideOffset?: PopoverPrimitive.PopoverContentProps["sideOffset"];
  align?: PopoverPrimitive.PopoverContentProps["align"];
  alignOffset?: PopoverPrimitive.PopoverContentProps["alignOffset"];
  className?: string;
  sideEffects?: {
    afterNext?: () => void;
    afterPrevious?: () => void;
  };
};

type Step = BaseStep &
  (
    | {
        animated?: undefined;
        fromSelector?: never;
        toSelector?: never;
        duration?: never;
      }
    | {
        animated: "drag";
        fromSelector: string;
        toSelector: string;
        duration?: number;
      }
  );

interface Tour {
  id: string;
  steps: Step[];
}

interface Translations {
  next: string;
  previous: string;
  finish: string;
  step: string;
  of: string;
}

function TourProvider({
  tours,
  children,
  translations,
}: {
  tours: Tour[];
  children: React.ReactNode;
  translations: Translations;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const activeTour = tours.find((tour) => tour.id === activeTourId);
  const steps = activeTour?.steps || [];

  function next() {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsOpen(false);
      setCurrentStepIndex(0);
      setActiveTourId(null);
      activeTourId && ToorHelper.complete(activeTourId) 
    }
    steps[currentStepIndex].sideEffects?.afterNext?.();
  }

  function previous() {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
    steps[currentStepIndex].sideEffects?.afterPrevious?.();
  }

  function close() {
    setIsOpen(false);
    setCurrentStepIndex(0);
    setActiveTourId(null);
    activeTourId && ToorHelper.complete(activeTourId)
  }

  function start(tourId: string) {
    const tour = tours.find((tour) => tour.id === tourId);
    if (tour && !ToorHelper.isCompleted(tour.id)) {
      if (tour.steps.length > 0) {
        setActiveTourId(tourId);
        setIsOpen(true);
        setCurrentStepIndex(0);
      } else {
        console.error(`Tour with id '${tourId}' has no steps.`);
      }
    } else {
      console.error(`Tour with id '${tourId}' not found.`);
    }
  }

  return (
    <TourContext.Provider
      value={{
        start,
        close,
      }}
    >
      {children}
      {isOpen && activeTour && steps.length > 0 && (
        <TourOverlay
          step={steps[currentStepIndex]}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          onNext={next}
          onPrevious={previous}
          onClose={close}
          translations={translations}
        />
      )}
    </TourContext.Provider>
  );
}

function TourOverlay({
  step,
  currentStepIndex,
  totalSteps,
  onNext,
  onPrevious,
  onClose,
  translations,
}: {
  step: Step;
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  translations: Translations;
}) {
  const [targets, setTargets] = useState<{ rect: DOMRect; radius: number }[]>(
    [],
  );

  useEffect(() => {
    let needsScroll = true;

    function updatePosition() {
      const elements = document.querySelectorAll(
        `[data-tour-step-id*='${step.id}']`,
      );

      if (elements.length > 0) {
        const validElements: {
          rect: {
            width: number;
            height: number;
            x: number;
            y: number;
            left: number;
            top: number;
            right: number;
            bottom: number;
            toJSON: () => void;
          };
          radius: number;
          element: Element;
        }[] = [];

        Array.from(elements).forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) return;

          const style = window.getComputedStyle(element);
          const radius = Number(style.borderRadius) || 4;

          validElements.push({
            rect: {
              width: rect.width,
              height: rect.height,
              x: rect.left,
              y: rect.top,
              left: rect.left,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
              toJSON: () => {},
            },
            radius,
            element,
          });
        });

        setTargets(validElements.map(({ rect, radius }) => ({ rect, radius })));

        if (validElements.length > 0 && needsScroll) {
          validElements[0].element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          needsScroll = false;
        }
      } else {
        setTargets([]);
      }
    }

    updatePosition();
    const handleResizeOrScroll = () => updatePosition();

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);

    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    const resizeObserver = new ResizeObserver(() => updatePosition());
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [step]);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (["ArrowRight", " ", "Enter"].includes(e.key)) {
        onNext();
      } else if (["ArrowLeft"].includes(e.key)) {
        onPrevious();
      }
    };

    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [step]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!document) return null;

  if (step.animated === "drag") {
    return (
      <TourDragAnimation
        fromSelector={step.fromSelector}
        toSelector={step.toSelector}
        duration={step.duration}
        onNext={onNext}
      />
    );
  }

  if (targets.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <svg className="absolute inset-0 size-full">
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targets.map((target, i) => (
              <rect
                key={i}
                x={target.rect.left}
                y={target.rect.top}
                width={target.rect.width}
                height={target.rect.height}
                rx={target.radius}
                fill="black"
              />
            ))}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          mask="url(#tour-mask)"
          className="fill-black opacity-20"
        />
        {targets.map((target, i) => {
          return (
            <rect
              key={i}
              x={target.rect.left}
              y={target.rect.top}
              width={target.rect.width}
              height={target.rect.height}
              rx={target.radius}
              className="stroke-primary fill-none stroke-2"
            />
          );
        })}
      </svg>
      {targets.length > 0 && (
        <Popover key={step.id} open={true}>
          <PopoverAnchor
            virtualRef={{
              current: {
                getBoundingClientRect: () =>
                  targets[0]?.rect || {
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    bottom: 0,
                    right: 0,
                    x: 0,
                    y: 0,
                    toJSON: () => {},
                  },
              },
            }}
          />
          <PopoverContent
            className={cn("px-0", step.className)}
            side={step.side}
            sideOffset={step.sideOffset}
            align={step.align}
            alignOffset={step.alignOffset}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            asChild
          >
            <Card>
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>
                  {translations.step} {currentStepIndex + 1} {translations.of}{" "}
                  {totalSteps}
                </CardDescription>
                <CardAction>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <XIcon />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>{step.content}</CardContent>
              <CardFooter className="justify-between">
                {currentStepIndex > 0 &&
                  (step.previousRoute ? (
                    <Button variant="outline" onClick={onPrevious} asChild>
                      <Link href={step.previousRoute}>
                        {step.previousLabel ?? translations.previous}
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={onPrevious}>
                      {step.previousLabel ?? translations.previous}
                    </Button>
                  ))}
                {step.nextRoute ? (
                  <Button className="ml-auto" onClick={onNext} asChild>
                    <Link href={step.nextRoute}>
                      {step.nextLabel ??
                        (currentStepIndex === totalSteps - 1
                          ? translations.finish
                          : translations.next)}
                    </Link>
                  </Button>
                ) : (
                  <Button className="ml-auto" onClick={onNext}>
                    {step.nextLabel ??
                      (currentStepIndex === totalSteps - 1
                        ? translations.finish
                        : translations.next)}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </PopoverContent>
        </Popover>
      )}
    </div>,
    document.body,
  );
}

export function TourDragAnimation({
  fromSelector,
  toSelector,
  duration = 3000,
  onNext,
}: TourDragAnimationProps) {
  const [fromRect, setFromRect] = useState<DOMRect | null>(null);
  const [toRect, setToRect] = useState<DOMRect | null>(null);
  const [clonedElement, setClonedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const fromEl = document.querySelector(
      `[data-tour-step-id*='${fromSelector}']`,
    );
    const toEl = document.querySelector(`[data-tour-step-id*='${toSelector}']`);

    if (!fromEl || !toEl) {
      console.warn(`Elements not found: ${fromSelector} or ${toSelector}`);
      return;
    }

    const fromBounds = fromEl.getBoundingClientRect();
    const toBounds = toEl.getBoundingClientRect();

    setFromRect(fromBounds);
    setToRect(toBounds);

    const clone = fromEl.cloneNode(true) as HTMLElement;
    clone.style.pointerEvents = "none";
    setClonedElement(clone);

    (toEl as HTMLElement).addEventListener("drop", onNext);
    (toEl as HTMLElement).addEventListener("added", onNext);

    return () => {
      setFromRect(null);
      setToRect(null);
      setClonedElement(null);

      (toEl as HTMLElement).removeEventListener("drop", onNext);
      (toEl as HTMLElement).removeEventListener("added", onNext);
    };
  }, [fromSelector, toSelector, onNext]);

  if (!fromRect || !toRect || !clonedElement) {
    return null;
  }

  const deltaX =
    toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2);
  const deltaY =
    toRect.top + toRect.height / 2 - (fromRect.top + fromRect.height / 2);

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className="absolute animate-pulse rounded-md ring-4 ring-primary ring-offset-2"
        style={{
          left: fromRect.left,
          top: fromRect.top,
          width: fromRect.width,
          height: fromRect.height,
        }}
      />

      <div
        className="absolute opacity-80 shadow-2xl"
        style={{
          left: fromRect.left,
          top: fromRect.top,
          width: fromRect.width,
          height: fromRect.height,
          animation: `tourDrag ${duration}ms ease-in-out infinite`,
        }}
        dangerouslySetInnerHTML={{ __html: clonedElement.outerHTML }}
      />

      <div
        className="absolute text-6xl"
        style={{
          left: fromRect.left + fromRect.width / 2 - 30,
          top: fromRect.top + fromRect.height / 2 - 30,
          animation: `tourDragCursor ${duration}ms ease-in-out infinite`,
        }}
      >
        👆
      </div>

      <div
        className="absolute animate-pulse rounded-md border-4 border-dashed border-primary"
        style={{
          left: toRect.left,
          top: toRect.top,
          width: toRect.width,
          height: toRect.height,
        }}
      />

      <style jsx>{`
        @keyframes tourDrag {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(${deltaX}px, ${deltaY}px) scale(0.9);
          }
        }

        @keyframes tourDragCursor {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(${deltaX}px, ${deltaY}px);
          }
        }
      `}</style>
    </div>,
    document.body,
  );
}

export { TourProvider, useTour, type Step, type Tour };
