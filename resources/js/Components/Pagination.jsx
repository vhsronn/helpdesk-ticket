import { Link } from '@inertiajs/react';

// Takes a Laravel paginator object. Builds labels ourselves, so no raw HTML is rendered.
export default function Pagination({ paginator }) {
    if (!paginator || paginator.last_page <= 1) return null;

    const pages = paginator.links.slice(1, -1); // numbered links only

    const item = (url, label, active = false, key = label) => {
        const cls =
            'rounded-md border px-3 py-1.5 text-sm ' +
            (active
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : url
                  ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400');
        return url ? (
            <Link key={key} href={url} preserveScroll className={cls}>
                {label}
            </Link>
        ) : (
            <span key={key} className={cls}>
                {label}
            </span>
        );
    };

    return (
        <nav className="mt-6 flex flex-wrap items-center justify-between gap-3" aria-label="Pagination">
            <p className="text-sm text-gray-600">
                Showing {paginator.from} to {paginator.to} of {paginator.total} tickets
            </p>
            <div className="flex flex-wrap gap-1">
                {item(paginator.prev_page_url, 'Previous', false, 'prev')}
                {pages.map((p) => item(p.url, p.label, p.active, `p-${p.label}`))}
                {item(paginator.next_page_url, 'Next', false, 'next')}
            </div>
        </nav>
    );
}
