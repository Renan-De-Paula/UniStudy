from accounts.models import User

class GamificationService:
    XP_REWARDS = {
        'CREATE_QUESTION': 5,
        'CREATE_ANSWER': 10,
        'VERIFIED_SOLUTION': 30,
        'PROFESSOR_VALIDATION': 50,
        'UPLOAD_MATERIAL': 20,
    }

    @staticmethod
    def award_xp(user: User, action: str):
        if action in GamificationService.XP_REWARDS:
            xp_to_add = GamificationService.XP_REWARDS[action]
            user.xp += xp_to_add
            user.save(update_fields=['xp'])
            return user.xp
        return None
