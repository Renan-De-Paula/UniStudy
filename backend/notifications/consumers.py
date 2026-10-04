import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_anonymous:
            # Em um cenário real com SimpleJWT, a autenticação precisará de um middleware customizado
            # Por agora, aceitamos conexões anônimas para facilitar o protótipo
            pass

        self.group_name = 'global_notifications'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_notification(self, event):
        message = event['message']
        type_notif = event.get('notif_type', 'info')

        await self.send(text_data=json.dumps({
            'message': message,
            'type': type_notif
        }))
