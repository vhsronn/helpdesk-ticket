import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TicketForm from './Partials/TicketForm';

export default function Create({ options }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">New Ticket</h2>}>
            <Head title="New Ticket" />
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-4 shadow-sm sm:p-6">
                <TicketForm options={options} />
            </div>
        </AuthenticatedLayout>
    );
}
