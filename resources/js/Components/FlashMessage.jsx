import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);

    const message = flash?.success || flash?.error || null;
    const isError = !flash?.success && !!flash?.error;

    useEffect(() => {
        if (!message) {
            setVisible(false);
            return;
        }
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 4000); // auto-dismiss
        return () => clearTimeout(timer);
    }, [flash]);

    if (!message || !visible) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
            <div
                role="alert"
                className={
                    'flex items-start justify-between rounded-md border px-4 py-3 text-sm ' +
                    (isError
                        ? 'border-red-200 bg-red-50 text-red-800'
                        : 'border-green-200 bg-green-50 text-green-800')
                }
            >
                <span>{message}</span>
                <button
                    type="button"
                    onClick={() => setVisible(false)}
                    className="ml-4 font-semibold hover:opacity-70"
                    aria-label="Dismiss"
                >
                    &times;
                </button>
            </div>
        </div>
    );
}
