import React from 'react';

export function StudyMultiFilter({ label, allLabel, selected, groups, onChange }: {
  label: string;
  allLabel: string;
  selected: string[];
  groups: { label: string | null; options: { id: string; label: string }[] }[];
  onChange: (values: string[]) => void;
}) {
  return <fieldset className="crivo-topic-filter crivo-question-multi">
    <legend>{label}</legend>
    <div className="crivo-question-multi-options">
      <label className="crivo-question-multi-choice">
        <input type="checkbox" checked={selected.length === 0} onChange={() => onChange([])} />
        <span>{allLabel}</span>
      </label>
      {groups.map((group, index) => <div key={group.label ?? index}>
        {group.label && <p className="crivo-question-multi-heading">{group.label}</p>}
        {group.options.map(option => <label key={option.id} className="crivo-question-multi-choice">
          <input type="checkbox" value={option.id} checked={selected.includes(option.id)}
            onChange={() => onChange(selected.includes(option.id) ? selected.filter(id => id !== option.id) : [...selected, option.id])} />
          <span>{option.label}</span>
        </label>)}
      </div>)}
    </div>
  </fieldset>;
}
