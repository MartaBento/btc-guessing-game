type InputProps = {
  label: string;
  labelDescription: string;
  type: "email" | "password" | "text";
  autoComplete?: string;
  placeholder: string;
};

function Input({
  label,
  labelDescription,
  type,
  autoComplete,
  placeholder,
}: InputProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={label}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {labelDescription}
      </label>
      <input
        id={label}
        name={label}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="block w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-500 placeholder:text-sm focus:ring-2 focus:ring-inset focus:ring-berkeleyBlue"
      />
    </div>
  );
}

export default Input;
