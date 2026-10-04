<?php
/**
 * CSRF TOKEN HELPER - Psicólogo Jarismar do Nascimento Melo
 */

if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    // Detecta HTTPS automaticamente — seguro em produção e em dev sem configuração manual
    ini_set('session.cookie_secure', isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 1 : 0);
    ini_set('session.use_strict_mode', 1);
    session_start();
}

function gerarTokenCSRF(): string {
    if (empty($_SESSION['csrf_token']) || tokenExpirado()) {
        $_SESSION['csrf_token']      = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }
    return $_SESSION['csrf_token'];
}

function tokenExpirado(): bool {
    if (!isset($_SESSION['csrf_token_time'])) return true;
    return (time() - $_SESSION['csrf_token_time']) > 3600;
}

function validarTokenCSRF(string $token): bool {
    if (empty($token) || empty($_SESSION['csrf_token'])) return false;
    if (tokenExpirado()) {
        unset($_SESSION['csrf_token'], $_SESSION['csrf_token_time']);
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

// Quando chamado diretamente via GET: retorna token JSON
if ($_SERVER['REQUEST_METHOD'] === 'GET' && basename($_SERVER['PHP_SELF']) === 'csrf.php') {
    header('Content-Type: application/json');
    echo json_encode(['token' => gerarTokenCSRF(), 'expires_in' => 3600]);
    exit;
}
