<?php

use App\Http\Controllers\TechnologyController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::resource('technologies', TechnologyController::class);
Route::resource('tags', TagController::class);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::delete('/technologies/bulk-delete', [TechnologyController::class, 'bulkDelete'])->name('technologies.bulk-delete');
Route::post('/technologies/bulk-update-tags', [TechnologyController::class, 'bulkUpdateTags'])->name('technologies.bulk-update-tags');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
