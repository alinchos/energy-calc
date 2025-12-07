interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-sm font-bold text-gray-900">{label}</label>
      <input
        className={`border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black ${className}`}
        {...props}
      />
    </div>
  );
}