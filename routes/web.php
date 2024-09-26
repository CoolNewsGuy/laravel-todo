<?php

use App\Http\Controllers\ColorController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProfileController;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
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

Route::resource('colors', ColorController::class)
  ->middleware(['auth', 'verified']);

Route::post('/add-sample-colors', function () {
  $sampleColors = ["#ace", "#f2c", "#2ec", "#9c2", "#ff8", "#2ff"];
  $user = Auth::user();

  foreach ($sampleColors as $color) {
    $user->colors()->create([
      'color' => $color,
    ]);
  }

  $user->has_added_color = true;
  $user->save();
})
  ->middleware(['auth', 'verified']);

Route::resource('comments', CommentController::class)
  ->middleware(['auth', 'verified']);

Route::post('colors/{color}/comments', [CommentController::class, 'store'])
  ->middleware(['auth', 'verified'])
  ->name('color.comments');

Route::post('/comments/{comment}/like', function (Request $request, Comment $comment) {
  if ($comment->user->id === $request->user()->id) {
    return redirect(route('colors.index'));
  }

  $likes = DB::table('likes');
  $existing_like = $likes
    ->where('user_id', $request->user()->id)
    ->where('comment_id', $comment->id);

  if ($existing_like->exists()) {
    $existing_like->delete();

    return;
  }

  $likes->insert([
    'comment_id' => $comment->id,
    'user_id' => Auth::user()->id
  ]);
})
  ->middleware(['auth'])
  ->name('comment.like');

require __DIR__ . '/auth.php';
