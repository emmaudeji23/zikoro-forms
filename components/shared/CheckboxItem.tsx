type CheckboxItemProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export const CheckboxItem: React.FC<CheckboxItemProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {/* BOX */}
      <div className="w-4 h-4 border border-foreground/30 flex items-center justify-center">
        {checked && <div className="w-2 h-2 bg-primary" />}
        </div>

      {/* HIDDEN NATIVE INPUT (for accessibility) */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
        disabled={disabled}
      />

      {/* LABEL */}
      <span className="text-sm">{label}</span>
    </label>
  );
};