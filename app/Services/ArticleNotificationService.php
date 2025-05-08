<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class ArticleNotificationService
{
    /**
     * Kotlinのコードを呼び出して通知を作成する
     *
     * @param string $title 通知のタイトル
     * @param string $url 通知のURL
     * @return array
     * @throws \Exception
     */
    public function createArticleNotification(string $title, string $url): array
    {
        $command = sprintf(
            'java -jar %s/app/Kotlin/build/libs/notification.jar %s %s',
            base_path(),
            escapeshellarg($title),
            escapeshellarg($url)
        );

        Log::info('Executing Kotlin notification service', [
            'command' => $command,
            'title' => $title,
            'url' => $url
        ]);

        $output = shell_exec($command);
        if ($output === null) {
            Log::error('Failed to execute Kotlin notification service', [
                'command' => $command
            ]);
            throw new \Exception('通知の作成に失敗しました');
        }

        $result = json_decode($output, true);
        if (isset($result['error'])) {
            Log::error('Kotlin notification service returned error', [
                'error' => $result['error']
            ]);
            throw new \Exception($result['error']);
        }

        Log::info('Successfully created notification', [
            'result' => $result
        ]);

        return $result;
    }

    /**
     * Kotlinのコードを呼び出して通知のバリデーションを行う
     *
     * @param string $title
     * @param string $url
     * @return bool
     * @throws \Exception
     */
    public function validateArticleNotification(string $title, string $url): bool
    {
        $command = sprintf(
            'java -jar %s/app/Kotlin/build/libs/notification.jar validate %s %s',
            base_path(),
            escapeshellarg($title),
            escapeshellarg($url)
        );

        $output = shell_exec($command);
        if ($output === null) {
            throw new \Exception('バリデーションに失敗しました');
        }

        $result = json_decode($output, true);
        return !isset($result['error']);
    }
} 