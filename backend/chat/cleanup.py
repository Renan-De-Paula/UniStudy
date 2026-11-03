import logging
from django.utils import timezone
from squads.models import SquadMessage
from .models import DirectMessage, MessagePurgeLog

logger = logging.getLogger(__name__)

def purge_weekly_messages(triggered_by='AUTO_SUNDAY', details=''):
    """
    Executa a faxina semanal do banco de dados, excluindo todas as mensagens
    de guildas (SquadMessage) e todas as mensagens privadas (DirectMessage).
    Mantém o banco de dados leve, rápido e com alto desempenho.
    """
    now = timezone.now()
    
    # 1. Contagem prévia
    squad_count = SquadMessage.objects.count()
    dm_count = DirectMessage.objects.count()
    
    # 2. Exclusão em lote
    SquadMessage.objects.all().delete()
    DirectMessage.objects.all().delete()
    
    # 3. Registro de auditoria
    execution_details = details or f"Limpeza semanal automática concluída em {timezone.localtime(now).strftime('%d/%m/%Y às %H:%M:%S')}."
    log = MessagePurgeLog.objects.create(
        squad_messages_deleted=squad_count,
        direct_messages_deleted=dm_count,
        triggered_by=triggered_by,
        details=execution_details
    )
    
    total = squad_count + dm_count
    logger.info(
        f"[CLEANUP] Faxina semanal concluída ({triggered_by}). "
        f"Guildas: {squad_count}, Privadas: {dm_count}, Total: {total} mensagens removidas."
    )
    
    return {
        "status": "success",
        "purged_at": now.isoformat(),
        "purged_at_formatted": timezone.localtime(now).strftime('%d/%m/%Y %H:%M:%S'),
        "squad_messages_deleted": squad_count,
        "direct_messages_deleted": dm_count,
        "total_deleted": total,
        "log_id": log.id,
        "triggered_by": triggered_by,
        "message": f"Faxina concluída com sucesso! {total} mensagens removidas do banco de dados."
    }
