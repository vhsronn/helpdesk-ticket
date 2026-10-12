import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PriorityBadge, StatusBadge } from '@/Components/Badges';

export default function Dashboard({ total, byStatus, recent }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Total tickets</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{total}</p>
                </div>
                {Object.entries(byStatus).map(([status, count]) => (
                    <div key={status} className="rounded-lg bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">{status}</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-lg bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <h3 className="font-semibold text-gray-800">Recent tickets</h3>
                    <Link href={route('tickets.index')} className="text-sm text-indigo-600 hover:underline">
                        View all
                    </Link>
                </div>
                {recent.length === 0 ? (
                    <p className="p-6 text-center text-sm text-gray-500">No tickets yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {recent.map((t) => (
                            <li key={t.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <Link href={route('tickets.show', t.id)} className="font-medium text-gray-900 hover:text-indigo-600">
                                    {t.title}
                                </Link>
                                <div className="flex gap-2">
                                    <PriorityBadge value={t.priority} />
                                    <StatusBadge value={t.status} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
