<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ActiveMiddleware
{
    public function handle($request, Closure $next)
    {
        if (Auth::check() && Auth::user()->ActiveStatus === 1) {
            return $next($request);
        }

        return redirect('/');
    }
}
