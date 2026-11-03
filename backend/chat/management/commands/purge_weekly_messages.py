from django.core.management.base import BaseCommand
from django.utils import timezone
from squads.models import SquadMessage
from chat.models import DirectMessage
from chat.cleanup import purge_weekly_messages

class Command(BaseCommand):
    help = 'Executa a faxina semanal: exclui mensagens de guildas e privadas para manter o banco leve.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Apenas conta quantas mensagens seriam excluídas, sem apagar nada.',
        )

    def handle(self, *args, **options):
        dry_run = options.get('dry_run', False)
        now = timezone.localtime(timezone.now())

        self.stdout.write(self.style.NOTICE(f"=== UniStudy Hub — Faxina Semanal de Mensagens ({now.strftime('%d/%m/%Y %H:%M:%S')}) ==="))

        squad_count = SquadMessage.objects.count()
        dm_count = DirectMessage.objects.count()
        total = squad_count + dm_count

        if dry_run:
            self.stdout.write(self.style.WARNING(f"[DRY-RUN] Nenhuma mensagem foi apagada."))
            self.stdout.write(f"- Mensagens de Guildas a excluir: {squad_count}")
            self.stdout.write(f"- Mensagens Privadas a excluir: {dm_count}")
            self.stdout.write(f"- Total a ser limpo: {total}")
            return

        result = purge_weekly_messages(triggered_by='COMMAND', details=f"Executado manualmente via manage.py às {now.strftime('%H:%M:%S')}")

        self.stdout.write(self.style.SUCCESS(
            f"✓ Sucesso! {result['squad_messages_deleted']} mensagens de guilda e "
            f"{result['direct_messages_deleted']} mensagens privadas foram permanentemente excluídas."
        ))
        self.stdout.write(self.style.SUCCESS(f"Banco de dados otimizado e leve para a nova semana!"))
