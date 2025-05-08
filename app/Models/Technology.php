<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Technology extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'status',
        'official_url',
        'repository_url',
        'current_version',
        'license',
        'notes',
    ];

    // 技術要素の種類
    const TYPE_FRAMEWORK = 'framework';
    const TYPE_LIBRARY = 'library';
    const TYPE_TOOL = 'tool';
    const TYPE_LANGUAGE = 'language';
    const TYPE_DATABASE = 'database';
    const TYPE_SERVICE = 'service';
    const TYPE_OTHER = 'other';

    // 技術要素のステータス
    const STATUS_ACTIVE = 'active';
    const STATUS_DEPRECATED = 'deprecated';
    const STATUS_EXPERIMENTAL = 'experimental';
    const STATUS_ARCHIVED = 'archived';

    // 種類の日本語表示
    public static function getTypeLabels()
    {
        \Log::info('getTypeLabels called');
        return [
            self::TYPE_FRAMEWORK => 'フレームワーク',
            self::TYPE_LIBRARY => 'ライブラリ',
            self::TYPE_TOOL => 'ツール',
            self::TYPE_LANGUAGE => 'プログラミング言語',
            self::TYPE_DATABASE => 'データベース',
            self::TYPE_SERVICE => 'サービス',
            self::TYPE_OTHER => 'その他',
        ];
    }

    // ステータスの日本語表示
    public static function getStatusLabels()
    {
        return [
            self::STATUS_ACTIVE => 'アクティブ',
            self::STATUS_DEPRECATED => '非推奨',
            self::STATUS_EXPERIMENTAL => '実験的',
            self::STATUS_ARCHIVED => 'アーカイブ',
        ];
    }

    // 種類の日本語ラベルを取得
    public function getTypeLabelAttribute()
    {
        \Log::info('getTypeLabelAttribute called', [
            'type' => $this->type,
            'attributes' => $this->getAttributes()
        ]);
        $labels = self::getTypeLabels();
        return $labels[$this->type] ?? $this->type;
    }

    // ステータスの日本語ラベルを取得
    public function getStatusLabelAttribute()
    {
        return self::getStatusLabels()[$this->status] ?? $this->status;
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'technology_tag');
    }

    protected static function booted()
    {
        static::retrieved(function ($model) {
            \Log::info('Technology model retrieved', [
                'id' => $model->id,
                'type' => $model->type,
                'appends' => $model->getAppends()
            ]);
        });
    }
}
