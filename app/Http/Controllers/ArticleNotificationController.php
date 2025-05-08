<?php

namespace App\Http\Controllers;

use App\Services\ArticleNotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ArticleNotificationController extends Controller
{
    protected $notificationService;

    public function __construct(ArticleNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * 通知を作成する
     */
    public function create(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url|max:255',
        ]);

        try {
            $notification = $this->notificationService->createArticleNotification(
                $request->title,
                $request->url
            );

            return response()->json([
                'message' => '通知が作成されました',
                'notification' => $notification
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '通知の作成に失敗しました',
                'error' => $e->getMessage()
            ], 400);
        }
    }
} 