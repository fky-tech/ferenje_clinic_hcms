export default function Card({
    children,
    title,
    subtitle,
    icon: Icon,
    actions,
    className = '',
    ...props
}) {
    return (
        <div className={`card p-6 ${className}`} {...props}>
            {(title || Icon || actions) && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        {Icon && (
                            <div className="p-2 bg-primary-100 rounded-lg">
                                <Icon className="w-6 h-6 text-primary-600" />
                            </div>
                        )}
                        <div>
                            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                        </div>
                    </div>
                    {actions && <div className="flex items-center space-x-2">{actions}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
