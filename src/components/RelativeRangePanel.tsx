import React from "react";
import type { RelativeRangePanelProps, TimeUnit } from "../types";
import { resolveClassNames } from "../utils/classnames";
import { formatDateTime } from "../utils/date";

export const RelativeRangePanel: React.FC<RelativeRangePanelProps> = ({
  relative,
  classNames: classNamesOverride,
  formatDate,
}) => {
  const cn = resolveClassNames(undefined, classNamesOverride);
  const fmt = formatDate || formatDateTime;

  return (
    <div data-cs="relative-panel" className={cn.relativePanel}>
      <div data-cs="relative-description" className={cn.relativeDescription}>
        Select a time range relative to <strong className={cn.relativeAccent}>now</strong>
      </div>
      <div data-cs="relative-form" className={cn.relativeForm}>
        <label data-cs="relative-form-label" className={cn.relativeFormLabel}>Last</label>
        <input
          type="number"
          data-cs="relative-form-input"
          className={cn.relativeFormInput}
          value={relative.value}
          onChange={e => relative.setValue(e.target.value)}
          min="1"
        />
        <select
          data-cs="relative-form-select"
          className={cn.relativeFormSelect}
          value={relative.unit}
          onChange={e => relative.setUnit(e.target.value as TimeUnit)}
        >
          {relative.timeUnits.map(u => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>
      <div data-cs="relative-preview" className={cn.relativePreview}>
        <span data-cs="relative-preview-label" className={cn.relativePreviewLabel}>Preview:</span>
        <code data-cs="relative-preview-value" className={cn.relativePreviewValue}>
          {fmt(relative.preview)} → now
        </code>
      </div>
      <button
        type="button"
        data-cs="apply"
        className={cn.applyButton}
        onClick={relative.apply}
      >
        Apply
      </button>
    </div>
  );
};
