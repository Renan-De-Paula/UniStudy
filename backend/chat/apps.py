from django.apps import AppConfig


class ChatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chat'

    def ready(self):
        # Inicia o agendador em segundo plano para limpeza todo domingo às 23:59
        try:
            from .scheduler import start_message_cleanup_scheduler
            start_message_cleanup_scheduler()
        except Exception:
            pass
