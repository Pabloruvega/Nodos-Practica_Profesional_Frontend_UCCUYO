
<?php
 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EvaluacionController;
 
// POST /api/evaluar — recibe datos de empresa, devuelve diagnóstico de cumplimiento
Route::post('/evaluar', [EvaluacionController::class, 'evaluar']);

?>