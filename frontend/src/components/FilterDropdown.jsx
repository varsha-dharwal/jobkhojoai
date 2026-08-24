import { useEffect, useRef, useState } from "react";

function ChevronIcon(){
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{marginLeft:2}}>
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// LinkedIn-style filter pill: click to open a panel of radio/checkbox options,
// staged locally until "Show results" (or cleared via "Reset") is pressed.
export default function FilterDropdown({ label, options, selected, multiSelect = false, onApply }){
  const [open, setOpen] = useState(false);
  const [staged, setStaged] = useState(selected);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    setStaged(selected);
    function onClickOutside(e){ if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    function onKeyDown(e){ if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isActive = multiSelect ? selected.length > 0 : Boolean(selected);
  const activeLabel = multiSelect
    ? (selected.length === 1
        ? options.find(o => o.value === selected[0])?.label
        : selected.length > 1 ? `${label} (${selected.length})` : label)
    : (options.find(o => o.value === selected)?.label || label);

  function toggleOption(value){
    if (multiSelect){
      setStaged(s => s.includes(value) ? s.filter(v => v !== value) : [...s, value]);
    } else {
      setStaged(s => s === value ? "" : value);
    }
  }

  function apply(){ onApply(staged); setOpen(false); }
  function reset(){ const cleared = multiSelect ? [] : ""; onApply(cleared); setOpen(false); }

  return (
    <div className="filter-dropdown" ref={ref}>
      <button
        type="button"
        className={`btn ${isActive ? "btn-primary" : "btn-ghost"}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(o => !o)}
      >
        {isActive ? activeLabel : label}
        <ChevronIcon />
      </button>
      {open && (
        <div className="filter-dropdown-panel" role="menu">
          <div className="filter-dropdown-options">
            {options.map(opt => (
              <label key={opt.value} className="filter-dropdown-option">
                <input
                  type={multiSelect ? "checkbox" : "radio"}
                  name={label}
                  checked={multiSelect ? staged.includes(opt.value) : staged === opt.value}
                  onChange={() => toggleOption(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
          <div className="filter-dropdown-footer">
            <button type="button" className="btn btn-ghost" onClick={reset}>Reset</button>
            <button type="button" className="btn btn-primary" onClick={apply}>Show results</button>
          </div>
        </div>
      )}
    </div>
  );
}
