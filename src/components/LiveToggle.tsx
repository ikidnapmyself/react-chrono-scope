import React from "react";
import type { LiveToggleProps } from "../types";
import { resolveClassNames } from "../utils/classnames";
import { cx } from "../utils/date";

export const LiveToggle: React.FC<LiveToggleProps> = ({
  live,
  classNames: classNamesOverride,
}) => {
  const cn = resolveClassNames(undefined, classNamesOverride);

  return (
    <button
      type="button"
      data-cs="live"
      data-active={live.isLive || undefined}
      className={cx(cn.liveButton, live.isLive && cn.liveButtonActive)}
      onClick={live.toggle}
      aria-pressed={live.isLive}
    >
      <span
        data-cs="live-dot"
        className={cx(cn.liveDot, live.isLive && cn.liveDotActive)}
        style={{ width: 7, height: 7, borderRadius: "50%", display: "inline-block" }}
      />
      {live.isLive ? "LIVE" : "Live"}
    </button>
  );
};
