<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('technology_tag', function (Blueprint $table) {
            $table->foreignId('technology_id')->constrained()->onDelete('cascade');
            $table->foreignId('tag_id')->constrained()->onDelete('cascade');
            $table->primary(['technology_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('technology_tag');
    }
};
