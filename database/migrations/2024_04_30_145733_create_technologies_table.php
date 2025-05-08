<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('technologies', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // 技術名 (必須)
            $table->string('type', 50); // 種類 (必須)
            $table->string('status', 50); // ステータス (必須)
            $table->string('official_url', 2048)->nullable(); // 公式サイトURL (任意)
            $table->string('repository_url', 2048)->nullable(); // リポジトリURL (任意)
            $table->string('current_version', 50)->nullable(); // バージョン (任意)
            $table->string('license', 100)->nullable(); // ライセンス (任意)
            $table->text('notes')->nullable(); // メモ (任意)
            $table->timestamps(); // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('technologies');
    }
};