import "./VaultProgressBar.css";

export interface VaultProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function clampProgressValue(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function formatProgressValue(value: number): string {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`;
}

export function VaultProgressBar({
  value,
  label = "Vault progress",
  showValue = true,
  className,
}: VaultProgressBarProps) {
  const progress = clampProgressValue(value);
  const progressText = formatProgressValue(progress);
  const classNames = [
    "vault-progress-bar",
    progress >= 100 ? "is-complete" : "is-active",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames}>
      {showValue && (
        <div className="vault-progress-bar-header">
          <span className="vault-progress-bar-label">{label}</span>
          <span className="vault-progress-bar-value">{progressText}</span>
        </div>
      )}
      <div
        className="vault-progress-bar-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-valuetext={progressText}
      >
        <div
          className="vault-progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
