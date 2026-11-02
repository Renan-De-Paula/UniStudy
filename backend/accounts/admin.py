from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils import timezone
from .models import User, UserRole, EmailVerificationToken, Friendship, TeacherVerificationRequest

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        'username', 'email', 'first_name', 'last_name', 
        'role', 'course', 'date_joined', 'is_email_verified', 'is_staff'
    )
    list_filter = ('role', 'is_email_verified', 'is_staff', 'is_superuser', 'is_active', 'course')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'course')
    ordering = ('-date_joined',)

    fieldsets = UserAdmin.fieldsets + (
        ('Informações Acadêmicas & Perfil', {
            'fields': (
                'role', 'course', 'semester', 'xp', 'is_mentor', 
                'bio', 'skills', 'avatar', 'is_email_verified'
            ),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informações Acadêmicas & Perfil', {
            'fields': (
                'role', 'course', 'semester', 'xp', 'is_mentor', 
                'bio', 'avatar', 'is_email_verified'
            ),
        }),
    )

@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'is_used', 'created_at', 'expires_at')
    list_filter = ('is_used', 'created_at')
    search_fields = ('user__username', 'user__email', 'token')
    readonly_fields = ('created_at',)

@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    list_display = ('requester', 'receiver', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('requester__username', 'receiver__username')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(TeacherVerificationRequest)
class TeacherVerificationRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'institution', 'status', 'proof_url', 'institutional_email', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'user__email', 'institution', 'proof_url')
    actions = ['approve_requests', 'reject_requests']

    @admin.action(description='✅ Aprovar Selecionados (Promover para Professor)')
    def approve_requests(self, request, queryset):
        count = 0
        for req in queryset:
            req.status = TeacherVerificationRequest.Status.APPROVED
            req.reviewed_at = timezone.now()
            req.save()
            user = req.user
            user.role = UserRole.PROFESSOR
            user.save()
            count += 1
        self.message_user(request, f"{count} professor(es) aprovado(s) com sucesso!")

    @admin.action(description='❌ Recusar Selecionados')
    def reject_requests(self, request, queryset):
        queryset.update(status=TeacherVerificationRequest.Status.REJECTED, reviewed_at=timezone.now())
        self.message_user(request, f"{queryset.count()} solicitação(ões) recusada(s).")
