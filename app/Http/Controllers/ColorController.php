<?php

namespace App\Http\Controllers;

use App\Models\Color;
use DB;
use Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ColorController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    return Inertia::render('Colors/Index', [
      'colors' => DB::table('colors')->orderBy('id')->get()
    ]);
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
  public function store(Request $request): RedirectResponse
  {
    $validated = $request->validate([
      'red'   => 'required|string|min:1|max:2|regex:/^[0-9A-F]+$/i',
      'green' => 'required|string|min:1|max:2|regex:/^[0-9A-F]+$/i',
      'blue'  => 'required|string|min:1|max:2|regex:/^[0-9A-F]+$/i',
    ]);


    $request->user()->colors()->create([
      'color' => '#' . $validated['red'] . $validated['green'] . $validated['blue']
    ]);

    return redirect(route('colors.index'));
  }

  /**
   * Display the specified resource.
   */
  public function show(Color $color)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Color $color)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Color $color): RedirectResponse
  {
    Gate::authorize('update', $color);

    $color->is_favorite = !$color->is_favorite;
    $color->save();

    return redirect(route('colors.index'));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Color $color)
  {
    //
  }
}
