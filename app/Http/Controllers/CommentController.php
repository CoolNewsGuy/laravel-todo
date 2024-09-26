<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Models\Comment;
use Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Redirect;

class CommentController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    //
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    //
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request, Color $color): RedirectResponse
  {
    $validated = $request->validate([
      'content' => 'required|string'
    ]);

    $comment = new Comment();
    $comment->content = $validated['content'];
    $comment->user_id = $request->user()->id;
    $comment->color_id = $color->id;
    $comment->save();

    return Redirect::route('colors.index');
  }

  /**
   * Display the specified resource.
   */
  public function show(Comment $comment)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Comment $comment)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Comment $comment)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Comment $comment): RedirectResponse
  {
    Gate::authorize('delete', $comment);

    $comment->delete();

    return Redirect::route('colors.index');
  }
}
