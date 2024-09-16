<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TodoController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

Route::get('/', function () {
  return Inertia::render('Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
    'laravelVersion' => Application::VERSION,
    'phpVersion' => PHP_VERSION,
  ]);
});

Route::get('/dashboard', function () {
  return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('todos', TodoController::class)
  ->only(['index', 'store', 'destroy', 'update'])
  ->middleware(["auth", "verified"]);

Route::get("/auth/google", function () {
  return Socialite::driver('google')->redirect();
});

Route::get('/auth/callback', function () {
  $googleUser = Socialite::driver('google')->user();

  $user = User::firstOrCreate(
    ['email' => $googleUser->email],
    [
      'name' => $googleUser->name,
      'google_id' => $googleUser->id,
      'password' => Hash::make(Str::random(16)),
    ]
  );

  Auth::login($user);

  return redirect('/dashboard');
});

require __DIR__ . '/auth.php';
