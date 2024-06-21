type ButtonProps = {
  label: string;
  type?: "button" | "submit";
  icon?: string;
  iconPosition?: "left" | "right";
  onClick?: () => void;
  ariaLabel?: string;
};

function Button({
  label,
  type = "button",
  icon,
  iconPosition = "left",
  onClick,
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      className="w-full inline-flex justify-center items-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-berkeleyBlue bg-berkeleyBlue text-white px-3 py-2 text-sm font-medium"
      onClick={onClick}
      aria-label={ariaLabel || label}
    >
      {iconPosition === "left" && icon && (
        <span aria-hidden="true">{icon}</span>
      )}
      <span>{label}</span>
      {iconPosition === "right" && icon && (
        <span aria-hidden="true">{icon}</span>
      )}
    </button>
  );
}

export default Button;
