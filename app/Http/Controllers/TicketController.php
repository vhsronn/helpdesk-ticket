<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    private function options(): array
    {
        return [
            'priorities' => Ticket::PRIORITIES,
            'statuses'   => Ticket::STATUSES,
            'categories' => Ticket::CATEGORIES,
        ];
    }

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Ticket::class);

        $filters = [
            'search'   => trim((string) $request->query('search', '')),
            'status'   => in_array($request->query('status'), Ticket::STATUSES, true) ? $request->query('status') : '',
            'priority' => in_array($request->query('priority'), Ticket::PRIORITIES, true) ? $request->query('priority') : '',
        ];

        $tickets = $request->user()->tickets()
            ->when($filters['search'], fn ($q, $s) => $q->where('title', 'like', '%' . $s . '%'))
            ->when($filters['status'], fn ($q, $s) => $q->where('status', $s))
            ->when($filters['priority'], fn ($q, $p) => $q->where('priority', $p))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $filters,
            'options' => $this->options(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Ticket::class);

        return Inertia::render('Tickets/Create', [
            'options' => $this->options(),
        ]);
    }

    public function store(StoreTicketRequest $request): RedirectResponse
    {
        // user_id comes from the session, never from the form.
        $ticket = $request->user()->tickets()->create($request->validated());

        return redirect()->route('tickets.show', $ticket)->with('success', 'Ticket created.');
    }

    public function show(Ticket $ticket): Response
    {
        Gate::authorize('view', $ticket);

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function edit(Ticket $ticket): Response
    {
        Gate::authorize('update', $ticket);

        return Inertia::render('Tickets/Edit', [
            'ticket'  => $ticket,
            'options' => $this->options(),
        ]);
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket): RedirectResponse
    {
        $ticket->update($request->validated());

        return redirect()->route('tickets.show', $ticket)->with('success', 'Ticket updated.');
    }

    public function destroy(Ticket $ticket): RedirectResponse
    {
        Gate::authorize('delete', $ticket);

        $ticket->delete();

        return redirect()->route('tickets.index')->with('success', 'Ticket deleted.');
    }
}
