import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PriorityBadge, StatusBadge } from '@/Components/Badges';
import DeleteTicketButton from '@/Components/DeleteTicketButton';

const fmt = (d) => new Date(d).toLocaleString();

export default function Show({ ticket }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Ticket #{ticket.id}</h2>}>
            <Head title={`Ticket #${ticket.id}`} />

            <div className="mx-auto max-w-3xl rounded-lg bg-white p-4 shadow-sm sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="break-words text-2xl font-bold text-gray-900">{ticket.title}</h3>
                    <div className="flex shrink-0 gap-2">
                        <PriorityBadge value={ticket.priority} />
                        <StatusBadge value={ticket.status} />
                    </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-gray-500">Category</dt>
                        <dd className="font-medium text-gray-900">{ticket.category}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Created</dt>
                        <dd className="font-medium text-gray-900">{fmt(ticket.created_at)}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Last updated</dt>
                        <dd className="font-medium text-gray-900">{fmt(ticket.updated_at)}</dd>
                    </div>
                </dl>

                <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-500">Description</h4>
                    {/* React escapes this text; whitespace-pre-wrap keeps line breaks. */}
                    <p className="mt-1 whitespace-pre-wrap break-words text-gray-800">{ticket.description}</p>
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-between">
                    <Link href={route('tickets.index')} className="text-sm text-gray-600 hover:text-gray-900">
                        &larr; Back to tickets
                    </Link>
                    <div className="flex gap-3">
                        <Link
                            href={route('tickets.edit', ticket.id)}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                        >
                            Edit
                        </Link>
                        <DeleteTicketButton ticket={ticket} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
