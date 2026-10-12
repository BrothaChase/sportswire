import { useEffect, useRef } from "react";
import { themes } from "../theme.js";

const labels = {
  green: ["Original Green", "Electric and energetic"],
  gold: ["Sportsbook Gold", "Current theme"],
  orange: ["Orange", "Warm and bold"],
  red: ["Red", "Competitive intensity"],
  purple: ["Purple", "Distinct and premium"],
  blue: ["Blue", "Clean and analytical"],
  analytics: ["Analytics Dark", "Neutral and data-focused"],
};

export default function SettingsDialog({ open, onClose, themeName, onThemeChange }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      className="settings-dialog"
      ref={dialogRef}
      onCancel={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
    >
      <div className="settings-head"><h2>Appearance</h2><button className="settings-close" type="button" onClick={onClose} aria-label="Close settings">×</button></div>
      <div className="settings-body">
        <h3>Accent theme</h3>
        <p>Choose the color used for active states, progress, highlights, and primary actions.</p>
        <div className="theme-grid">
          {Object.entries(themes).map(([name, theme]) => (
            <button
              className={`theme-choice ${themeName === name ? "selected" : ""}`}
              type="button"
              key={name}
              onClick={() => onThemeChange(name)}
              style={{ "--swatch": theme.accent }}
            >
              <span className="theme-swatch" /><strong>{labels[name][0]}</strong><small>{labels[name][1]}</small>
            </button>
          ))}
        </div>
        <div className="settings-note">Your selection is saved on this device. Custom colors can be added later.</div>
      </div>
    </dialog>
  );
}
