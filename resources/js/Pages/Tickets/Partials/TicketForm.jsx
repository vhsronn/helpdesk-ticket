import { Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

const selectClass =
    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

export default function TicketForm({ ticket = null, options }) {
    const isEdit = ticket !== null;

    const { data, setData, post, put, processing, errors } = useForm({
        title: ticket?.title ?? '',
        description: ticket?.description ?? '',
        priority: ticket?.priority ?? 'Medium',
        status: ticket?.status ?? 'Open',
        category: ticket?.category ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('tickets.update', ticket.id));
        } else {
            post(route('tickets.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="title" value="Title" />
                <TextInput
                    id="title"
                    className="mt-1 block w-full"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    isFocused
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="description" value="Description" />
                <textarea
                    id="description"
                    rows={6}
                    className={selectClass}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                    <InputLabel htmlFor="priority" value="Priority" />
                    <select id="priority" className={selectClass} value={data.priority} onChange={(e) => setData('priority', e.target.value)}>
                        {options.priorities.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    <InputError message={errors.priority} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="status" value="Status" />
                    <select id="status" className={selectClass} value={data.status} onChange={(e) => setData('status', e.target.value)}>
                        {options.statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <InputError message={errors.status} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="category" value="Category" />
                    <select id="category" className={selectClass} value={data.category} onChange={(e) => setData('category', e.target.value)}>
                        <option value="" disabled>Select a category</option>
                        {options.categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <InputError message={errors.category} className="mt-2" />
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Link
                    href={isEdit ? route('tickets.show', ticket.id) : route('tickets.index')}
                    className="text-center text-sm text-gray-600 hover:text-gray-900"
                >
                    Cancel
                </Link>
                <PrimaryButton disabled={processing} className="justify-center">
                    {processing ? 'Saving...' : isEdit ? 'Update Ticket' : 'Create Ticket'}
                </PrimaryButton>
            </div>
        </form>
    );
}
