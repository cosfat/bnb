export default function FormButton({ 
  children, 
  type = "button", 
  variant = "primary", 
  className = "", 
  disabled = false, 
  onClick 
}) {
  const baseClasses = "px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm font-medium";
  
  const variantClasses = {
    primary: "border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    danger: "border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`;
  
  return (
    <button 
      type={type} 
      className={buttonClasses} 
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
} 