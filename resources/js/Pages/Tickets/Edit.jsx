import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TicketForm from './Partials/TicketForm';

export default function Edit({ ticket, options }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Ticket #{ticket.id}</h2>}>
            <Head title={`Edit Ticket #${ticket.id}`} />
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-4 shadow-sm sm:p-6">
                <TicketForm ticket={ticket} options={options} />
            </div>
        </AuthenticatedLayout>
    );
}
