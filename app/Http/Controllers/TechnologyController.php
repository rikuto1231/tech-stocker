<?php

namespace App\Http\Controllers;

use App\Models\Technology;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use League\Csv\Writer;

class TechnologyController extends Controller
{
    public function index(Request $request)
    {
        $query = Technology::with('tags');

        // 検索機能
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('current_version', 'like', "%{$search}%")
                    ->orWhere('license', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        // タグフィルター
        if ($request->filled('tag_id')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('tags.id', $request->tag_id);
            });
        }

        // ソート機能
        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $technologies = $query->latest()->paginate(10);
        $tags = Tag::all();

        return Inertia::render('Technologies/Index', [
            'technologies' => $technologies,
            'tags' => $tags,
            'filters' => $request->only(['search', 'tag_id', 'sort', 'direction'])
        ]);
    }

    public function create()
    {
        $tags = Tag::all();
        return Inertia::render('Technologies/Create', [
            'tags' => $tags
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'official_url' => 'nullable|url|max:255',
            'repository_url' => 'nullable|url|max:255',
            'current_version' => 'nullable|string|max:255',
            'license' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $technology = Technology::create($validated);

        if (isset($validated['tag_ids'])) {
            $technology->tags()->sync($validated['tag_ids']);
        }

        return redirect()->route('technologies.index')
            ->with('success', '技術要素が正常に登録されました。');
    }

    public function show(Technology $technology)
    {
        $technology->load('tags');
        return Inertia::render('Technologies/Show', [
            'technology' => $technology
        ]);
    }

    public function edit(Technology $technology)
    {
        $technology->load('tags');
        $tags = Tag::all();
        return Inertia::render('Technologies/Edit', [
            'technology' => $technology,
            'tags' => $tags
        ]);
    }

    public function update(Request $request, Technology $technology)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'official_url' => 'nullable|url|max:255',
            'repository_url' => 'nullable|url|max:255',
            'current_version' => 'nullable|string|max:255',
            'license' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $technology->update($validated);

        if (isset($validated['tag_ids'])) {
            $technology->tags()->sync($validated['tag_ids']);
        } else {
            $technology->tags()->detach();
        }

        return redirect()->route('technologies.index')
            ->with('success', '技術要素が正常に更新されました。');
    }

    public function destroy(Technology $technology)
    {
        $technology->delete();

        return redirect()->route('technologies.index')
            ->with('success', '技術要素が正常に削除されました。');
    }

    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:technologies,id',
        ]);

        Technology::whereIn('id', $validated['ids'])->delete();

        return redirect()->route('technologies.index')
            ->with('success', '選択した技術要素が正常に削除されました。');
    }

    public function bulkUpdateTags(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:technologies,id',
            'tag_ids' => 'required|array',
            'tag_ids.*' => 'exists:tags,id',
            'action' => 'required|in:add,remove',
        ]);

        $technologies = Technology::whereIn('id', $validated['ids'])->get();

        foreach ($technologies as $technology) {
            if ($validated['action'] === 'add') {
                $technology->tags()->syncWithoutDetaching($validated['tag_ids']);
            } else {
                $technology->tags()->detach($validated['tag_ids']);
            }
        }

        return redirect()->route('technologies.index')
            ->with('success', '選択した技術要素のタグを更新しました。');
    }

    public function export(Request $request, Technology $technology = null)
    {
        \Log::info('Export request received', [
            'technology' => $technology ? $technology->id : null,
            'has_ids' => $request->has('ids'),
            'ids' => $request->input('ids'),
            'all_params' => $request->all()
        ]);

        if ($technology) {
            // 個別の技術要素のエクスポート
            $technologies = collect([$technology]);
            $filename = "technology_{$technology->id}.csv";
            \Log::info('Exporting single technology', ['id' => $technology->id]);
        } else {
            // 全技術要素のエクスポート
            $technologies = Technology::with('tags')->get();
            $filename = "technologies.csv";
            \Log::info('Exporting all technologies');
        }
        
        $csv = Writer::createFromString('');
        
        // ヘッダー行の追加
        $csv->insertOne([
            'ID',
            '技術名',
            '種類',
            'ステータス',
            '現在のバージョン',
            'ライセンス',
            'メモ',
            'タグ',
            '作成日',
            '更新日'
        ]);

        // データ行の追加
        foreach ($technologies as $tech) {
            $csv->insertOne([
                $tech->id,
                $tech->name,
                $tech->type,
                $tech->status,
                $tech->current_version,
                $tech->license,
                $tech->notes,
                $tech->tags->pluck('name')->join(', '),
                $tech->created_at,
                $tech->updated_at
            ]);
        }

        \Log::info('CSV generation completed', [
            'filename' => $filename,
            'row_count' => $technologies->count()
        ]);

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        return response($csv->toString(), 200, $headers);
    }
} 