import React from "react";
import type { NavigationToolbarProps } from "../types";
import { resolveClassNames } from "../utils/classnames";

export const NavigationToolbar: React.FC<NavigationToolbarProps> = ({
  nav,
  classNames: classNamesOverride,
}) => {
  const cn = resolveClassNames(undefined, classNamesOverride);

  return (
    <div data-cs="toolbar-nav" className={cn.toolbarNavGroup}>
      <button type="button" data-cs="nav" className={cn.navButton} onClick={nav.shiftBack} aria-label="Shift back" title="Shift back">
        <span className={cn.navButtonIcon}>‹</span>
      </button>
      <button type="button" data-cs="nav" className={cn.navButton} onClick={nav.zoomOut} aria-label="Zoom out" title="Zoom out">
        <span className={cn.navButtonIcon}>−</span>
      </button>
      <button type="button" data-cs="nav" className={cn.navButton} onClick={nav.zoomIn} aria-label="Zoom in" title="Zoom in">
        <span className={cn.navButtonIcon}>+</span>
      </button>
      <button type="button" data-cs="nav" className={cn.navButton} onClick={nav.shiftForward} aria-label="Shift forward" title="Shift forward">
        <span className={cn.navButtonIcon}>›</span>
      </button>
    </div>
  );
};
