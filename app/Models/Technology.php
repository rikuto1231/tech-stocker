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

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'technology_tag');
    }
}
