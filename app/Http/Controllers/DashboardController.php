<?php

namespace App\Http\Controllers;

use App\Models\Technology;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        Log::info('DashboardController@index called');

        // 種類ごとの分布を取得
        $typeDistribution = Technology::select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->get();

        Log::info('Type distribution:', ['data' => $typeDistribution->toArray()]);

        // ステータスごとの分布を取得
        $statusDistribution = Technology::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        Log::info('Status distribution:', ['data' => $statusDistribution->toArray()]);

        // 全体の統計情報
        $statistics = [
            'total_technologies' => Technology::count(),
            'total_active' => Technology::where('status', 'アクティブ')->count(),
            'total_deprecated' => Technology::where('status', '非推奨')->count(),
            'recently_added' => Technology::orderBy('created_at', 'desc')
                ->take(5)
                ->with('tags')
                ->get(),
        ];

        Log::info('Statistics:', ['data' => $statistics]);

        return Inertia::render('Dashboard/Index', [
            'typeDistribution' => $typeDistribution,
            'statusDistribution' => $statusDistribution,
            'statistics' => $statistics,
        ]);
    }
} 