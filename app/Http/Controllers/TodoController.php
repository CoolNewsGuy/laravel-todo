<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TodoController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(): Response
  {

    return Inertia::render("Todos", [
      'todos' => Todo::all()
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
      "title" => "required|string|max:255"
    ]);

    $request->user()->todos()->create($validated);

    return redirect(route('todos.index'));
  }

  /**
   * Display the specified resource.
   */
  public function show(Todo $todo)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Todo $todo)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Todo $todo)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Todo $todo): RedirectResponse
  {
    Gate::authorize("delete", $todo);

    $todo->delete();

    return redirect(route('todos.index'));
  }
}
