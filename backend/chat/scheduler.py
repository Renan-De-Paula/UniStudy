import os
import sys
import time
import threading
import logging
from datetime import timedelta
from django.utils import timezone

logger = logging.getLogger(__name__)

_scheduler_started = False
_lock = threading.Lock()

def _cleanup_loop():
    logger.info("[CLEANUP-SCHEDULER] Agendador de limpeza semanal ativo (Alvo: Todo domingo às 23:59 BRT).")
    
    while True:
        try:
            now = timezone.localtime(timezone.now())
            today_str = now.strftime('%Y-%m-%d')
            
            from chat.models import MessagePurgeLog
            from chat.cleanup import purge_weekly_messages

            # 1. Alvo Principal: Domingo às 23:59 (weekday() == 6)
            is_sunday = (now.weekday() == 6)
            is_target_minute = (now.hour == 23 and now.minute == 59)
            
            if is_sunday and is_target_minute:
                # Verifica se já rodou hoje para não duplicar no mesmo minuto
                already_purged_today = MessagePurgeLog.objects.filter(
                    purged_at__date=now.date()
                ).exists()
                
                if not already_purged_today:
                    logger.info(f"[CLEANUP-SCHEDULER] Domingo 23:59 alcançado ({now.strftime('%d/%m/%Y %H:%M:%S')}). Disparando faxina semanal...")
                    purge_weekly_messages(
                        triggered_by='AUTO_SUNDAY',
                        details=f"Execução automática programada de Domingo às 23:59 (Horário de Brasília)."
                    )
                    # Aguarda 65 segundos para sair com segurança do minuto 23:59
                    time.sleep(65)
                    continue

            # 2. Catch-up Inteligente: Se for segunda-feira e o servidor estava desligado no domingo à noite
            elif now.weekday() == 0:
                # Verifica se houve qualquer limpeza nos últimos 6 dias
                has_recent_purge = MessagePurgeLog.objects.filter(
                    purged_at__gte=now - timedelta(days=6)
                ).exists()
                
                if not has_recent_purge:
                    logger.info("[CLEANUP-SCHEDULER] Segunda-feira detectada sem faxina recente no domingo. Executando catch-up semanal...")
                    purge_weekly_messages(
                        triggered_by='CATCHUP_MONDAY',
                        details="Catch-up automático na segunda-feira devido a servidor desligado no domingo às 23:59."
                    )
                    time.sleep(30)
                    continue

        except Exception as e:
            logger.error(f"[CLEANUP-SCHEDULER] Erro no loop de agendamento: {e}", exc_info=True)
            
        # Verifica a cada 25 segundos
        time.sleep(25)

def start_message_cleanup_scheduler():
    global _scheduler_started
    with _lock:
        if _scheduler_started:
            return
            
        # Evita inicializar o scheduler durante comandos de terminal (ex: migrate, test, makemigrations, etc.)
        ignored_commands = ['migrate', 'makemigrations', 'test', 'shell', 'purge_weekly_messages', 'check']
        if any(cmd in sys.argv for cmd in ignored_commands):
            return

        # No ambiente local com 'python manage.py runserver', o Django inicia dois processos (reloader e servidor).
        # Queremos rodar apenas no processo principal de serviço (onde RUN_MAIN == 'true').
        # Em produção (Gunicorn / Render / WSGI), RUN_MAIN não existe e a thread inicia normalmente.
        is_runserver = 'runserver' in sys.argv
        if is_runserver and os.environ.get('RUN_MAIN') != 'true':
            return

        thread = threading.Thread(target=_cleanup_loop, daemon=True, name="WeeklyMessageCleanupScheduler")
        thread.start()
        _scheduler_started = True
