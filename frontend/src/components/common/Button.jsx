const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200",

  secondary:
    "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 focus:ring-4 focus:ring-slate-200",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-200",

  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-4 focus:ring-slate-200",
};

const Button = ({
  children,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        px-5
        py-3
        text-sm
        font-medium
        transition-all
        duration-300
        focus:outline-none
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;