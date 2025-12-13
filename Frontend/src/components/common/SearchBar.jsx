import { Search } from 'lucide-react';
import Input from './Input';

export default function SearchBar({
    value,
    onChange,
    placeholder = 'Search...',
    onSearch,
    className = ''
}) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(value);
        }
    };

    return (
        <div className={className}>
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                icon={Search}
            />
        </div>
    );
}
