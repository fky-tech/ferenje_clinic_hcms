import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    type = 'text',
    icon: Icon = null,
    className = '',
    required = false,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={`
            w-full rounded-lg border transition-all duration-200
            ${Icon ? 'pl-10 pr-4' : 'px-4'} py-2
            ${error
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                            : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                        }
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
