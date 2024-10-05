import { useState, useEffect } from 'react';

function usePersistentState<T>(key: string, initialValue: T) {
    // Retrieve stored value if available
    const getInitialValue = () => {
        if (typeof window === 'undefined') return initialValue; // Prevent SSR issues
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialValue;
    };

    const [value, setValue] = useState<T>(getInitialValue);

    useEffect(() => {
        // Store value in localStorage whenever it changes
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;  // Returning as const for correct tuple typing
}

export default usePersistentState;