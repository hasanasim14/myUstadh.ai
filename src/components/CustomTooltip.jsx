import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";

/**
 * @param {{ children: React.ReactNode, content: string }} props
 */
export default function TooltipWrapper({ children, content }) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            className="z-50 rounded bg-gray-900 px-2 py-1 text-sm text-white shadow-md animate-fadeIn data-[state=delayed-open]:data-[side=top]:slide-in-from-bottom-1"
          >
            {content}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
