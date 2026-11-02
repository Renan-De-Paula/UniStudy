from django.db import migrations

def run_seed(apps, schema_editor):
    try:
        from setup_users import setup
        setup()
    except Exception as e:
        print("Aviso ao executar setup_users:", e)
        
    try:
        from seed_data import seed
        seed()
    except Exception as e:
        print("Aviso ao executar seed_data:", e)

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_teacherverificationrequest'),
        ('gamification', '0003_badge_badge_tier_badge_icon_emoji_badge_quiz_and_more'),
        ('squads', '0002_alter_squad_max_members_alter_squad_needed_skills_and_more'),
    ]

    operations = [
        migrations.RunPython(run_seed, reverse_code=migrations.RunPython.noop),
    ]
