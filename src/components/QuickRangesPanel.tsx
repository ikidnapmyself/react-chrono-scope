import React from "react";
import type { QuickRangesPanelProps } from "../types";
import { resolveClassNames } from "../utils/classnames";
import { cx } from "../utils/date";

export const QuickRangesPanel: React.FC<QuickRangesPanelProps> = ({
  quick,
  classNames: classNamesOverride,
  renderItem,
}) => {
  const cn = resolveClassNames(undefined, classNamesOverride);

  return (
    <div data-cs="quick-panel" className={cn.quickPanel}>
      <input
        type="text"
        data-cs="quick-search"
        className={cn.quickSearch}
        placeholder="Search quick ranges..."
        value={quick.filter}
        onChange={e => quick.setFilter(e.target.value)}
      />
      <div data-cs="quick-list" className={cn.quickList}>
        {quick.filteredRanges.map(range => {
          const isActive = quick.activeLabel === range.label;
          const handleSelect = () => quick.select(range);

          if (renderItem) {
            return (
              <React.Fragment key={range.label}>
                {renderItem(range, isActive, handleSelect, cn)}
              </React.Fragment>
            );
          }

          return (
            <button
              key={range.label}
              type="button"
              data-cs="quick-item"
              data-active={isActive || undefined}
              className={cx(cn.quickItem, isActive && cn.quickItemActive)}
              onClick={handleSelect}
            >
              <span data-cs="quick-item-label" className={cn.quickItemLabel}>{range.label}</span>
              {isActive && <span data-cs="quick-item-dot" className={cn.quickItemDot} />}
            </button>
          );
        })}
        {quick.filteredRanges.length === 0 && (
          <div data-cs="quick-empty" className={cn.quickEmpty}>No matches</div>
        )}
      </div>
    </div>
  );
};
