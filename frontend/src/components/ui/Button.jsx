const Button = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  ...props 
}) => {
  const baseStyles = 'font-bold rounded-lg outline outline-2 transition-all duration-200 cursor-[url(\'/assets/cursor.png\'),_pointer]'
  
  const variants = {
    primary: 'bg-cyan-700 outline-slate-800 text-white hover:bg-cyan-800 shadow-md',
    secondary: 'bg-gray-200 outline-gray-400 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 outline-red-800 text-white hover:bg-red-700',
  }
  
  const sizes = {
    sm: 'px-3 py-1 text-xs h-6',
    md: 'px-5 py-2 text-xs h-8',
    lg: 'px-6 py-3 text-sm h-10',
  }
  
  const finalClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <button className={finalClassName} {...props}>
      {children}
    </button>
  )
}

export default Button
