from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, HttpResponse

def health_check(request):
    if 'text/html' in request.META.get('HTTP_ACCEPT', ''):
        return HttpResponse("""
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>UniStudy Hub — Servidor Backend API</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background-color: #0b0f19;
                    color: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    padding: 20px;
                }
                .card {
                    background: #131b2e;
                    border: 1px solid #1e293b;
                    border-radius: 24px;
                    padding: 40px 32px;
                    max-width: 500px;
                    width: 100%;
                    text-align: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
                }
                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(16, 185, 129, 0.15);
                    color: #34d399;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    padding: 6px 14px;
                    border-radius: 9999px;
                    font-weight: 700;
                    font-size: 12px;
                    margin-bottom: 24px;
                }
                h1 {
                    font-size: 26px;
                    font-weight: 900;
                    color: #ffffff;
                    margin-bottom: 12px;
                    letter-spacing: -0.5px;
                }
                h1 span {
                    color: #a855f7;
                }
                p {
                    color: #94a3b8;
                    font-size: 14px;
                    line-height: 1.6;
                    margin-bottom: 28px;
                }
                .btn {
                    display: block;
                    width: 100%;
                    padding: 14px 20px;
                    margin-bottom: 12px;
                    border-radius: 14px;
                    font-weight: 700;
                    text-decoration: none;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                .btn-primary {
                    background: linear-gradient(135deg, #7c3aed, #9333ea);
                    color: #ffffff;
                    box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.4);
                }
                .btn-primary:hover {
                    opacity: 0.95;
                    transform: translateY(-1px);
                }
                .btn-secondary {
                    background: #1e293b;
                    color: #e2e8f0;
                    border: 1px solid #334155;
                }
                .btn-secondary:hover {
                    background: #334155;
                }
                .hint {
                    margin-top: 16px;
                    font-size: 12px;
                    color: #64748b;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="badge">🟢 Servidor Online & Banco Conectado</div>
                <h1>UniStudy Hub <span>API</span></h1>
                <p>
                    Você acessou a porta do <strong>Servidor Backend (Django)</strong>.<br/>
                    Para abrir o aplicativo com a interface visual de estudos, clique no botão abaixo:
                </p>
                <a href="http://localhost:5173" class="btn btn-primary">🚀 Abrir UniStudy Hub (Frontend)</a>
                <a href="/admin/" class="btn btn-secondary">⚙️ Painel Django Admin (/admin)</a>
                <div class="hint">Frontend: http://localhost:5173 • Backend: http://localhost:8001</div>
            </div>
        </body>
        </html>
        """)
    return JsonResponse({
        "status": "online",
        "app": "UniStudy Hub API",
        "version": "1.0.0",
        "database": "connected"
    })

urlpatterns = [
    path('', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/community/', include('community.urls')),
    path('api/squads/', include('squads.urls')),
    path('api/repository/', include('repository.urls')),
    path('api/gamification/', include('gamification.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/trilha_ia/', include('trilha_ia.urls')),
]
