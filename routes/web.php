<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FornecedorController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [FornecedorController::class, 'fetchAll']);

Route::post('/result=sucess', [FornecedorController::class, 'store'])->name('registrar_fornecedor');