import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PriorityBadge, StatusBadge } from '@/Components/Badges';
import Pagination from '@/Components/Pagination';
import DeleteTicketButton from '@/Components/DeleteTicketButton';

const fieldClass = 'rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500';
const date = (d) => new Date(d).toLocaleDateString();

export default function Index({ tickets, filters, options }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [priority, setPriority] = useState(filters.priority ?? '');

    const apply = (next = {}) => {
        const params = { search, status, priority, ...next };
        Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
        router.get(route('tickets.index'), params, { preserveState: true, replace: true });
    };

    const reset = () => {
        setSearch('');
        setStatus('');
        setPriority('');
        router.get(route('tickets.index'), {}, { preserveState: true, replace: true });
    };

    const hasFilters = filters.search || filters.status || filters.priority;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">My Tickets</h2>
                    <Link href={route('tickets.create')} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 sm:hidden">
                        + New
                    </Link>
                </div>
            }
        >
            <Head title="Tickets" />

            {/* Filters */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    apply();
                }}
                className="mb-4 grid grid-cols-1 gap-3 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-4"
            >
                <input
                    type="search"
                    placeholder="Search title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={fieldClass + ' sm:col-span-2'}
                />
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        apply({ status: e.target.value });
                    }}
                    className={fieldClass}
                >
                    <option value="">All statuses</option>
                    {options.statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <select
                    value={priority}
                    onChange={(e) => {
                        setPriority(e.target.value);
                        apply({ priority: e.target.value });
                    }}
                    className={fieldClass}
                >
                    <option value="">All priorities</option>
                    {options.priorities.map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
                <div className="flex gap-2 sm:col-span-4">
                    <button type="submit" className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
                        Search
                    </button>
                    {hasFilters && (
                        <button type="button" onClick={reset} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Clear filters
                        </button>
                    )}
                </div>
            </form>

            {tickets.data.length === 0 ? (
                <div className="rounded-lg bg-white p-10 text-center shadow-sm">
                    <p className="text-lg font-semibold text-gray-800">
                        {hasFilters ? 'No tickets match your filters.' : 'You have no tickets yet.'}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {hasFilters ? 'Try clearing the filters.' : 'Create your first ticket to get started.'}
                    </p>
                    {!hasFilters && (
                        <Link href={route('tickets.create')} className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                            + New Ticket
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden overflow-hidden rounded-lg bg-white shadow-sm md:block">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Priority</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {tickets.data.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="max-w-xs truncate px-4 py-3 font-medium text-gray-900">
                                            <Link href={route('tickets.show', t.id)} className="hover:text-indigo-600">
                                                {t.title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{t.category}</td>
                                        <td className="px-4 py-3"><PriorityBadge value={t.priority} /></td>
                                        <td className="px-4 py-3"><StatusBadge value={t.status} /></td>
                                        <td className="px-4 py-3 text-gray-600">{date(t.created_at)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('tickets.edit', t.id)} className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50">
                                                    Edit
                                                </Link>
                                                <DeleteTicketButton ticket={t} className="!py-1.5" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile stacked cards */}
                    <div className="space-y-3 md:hidden">
                        {tickets.data.map((t) => (
                            <div key={t.id} className="rounded-lg bg-white p-4 shadow-sm">
                                <Link href={route('tickets.show', t.id)} className="block break-words font-semibold text-gray-900">
                                    {t.title}
                                </Link>
                                <p className="mt-1 text-xs text-gray-500">{t.category} &middot; {date(t.created_at)}</p>
                                <div className="mt-2 flex gap-2">
                                    <PriorityBadge value={t.priority} />
                                    <StatusBadge value={t.status} />
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <Link href={route('tickets.edit', t.id)} className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-center text-sm text-gray-700">
                                        Edit
                                    </Link>
                                    <DeleteTicketButton ticket={t} className="flex-1" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination paginator={tickets} />
                </>
            )}
        </AuthenticatedLayout>
    );
}
