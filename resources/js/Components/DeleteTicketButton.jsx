import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';

// Asks for confirmation before deleting.
export default function DeleteTicketButton({ ticket, className = '', children = 'Delete' }) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm({});

    const confirmDelete = () => {
        destroy(route('tickets.destroy', ticket.id), {
            preserveScroll: true,
            onFinish: () => setOpen(false),
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={
                    'rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 ' +
                    className
                }
            >
                {children}
            </button>

            <Modal show={open} onClose={() => setOpen(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Delete this ticket?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        &ldquo;{ticket.title}&rdquo; will be permanently removed. This cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setOpen(false)}>Cancel</SecondaryButton>
                        <DangerButton onClick={confirmDelete} disabled={processing}>
                            {processing ? 'Deleting...' : 'Delete ticket'}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </>
    );
}
