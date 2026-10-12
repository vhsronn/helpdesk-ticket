<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $tickets = $request->user()->tickets();

        $byStatus = (clone $tickets)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('Dashboard', [
            'total'    => (clone $tickets)->count(),
            'byStatus' => collect(Ticket::STATUSES)->mapWithKeys(fn ($s) => [$s => (int) ($byStatus[$s] ?? 0)]),
            'recent'   => (clone $tickets)->latest()->limit(5)->get(['id', 'title', 'priority', 'status', 'created_at']),
        ]);
    }
}
