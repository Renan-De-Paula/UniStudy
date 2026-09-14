from django.db import models
from django.conf import settings

class Discipline(models.Model):
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=20, unique=True)
    course = models.CharField(max_length=150)
    semester = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.name} ({self.code})"

class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_question = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    upvotes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='upvoted_posts', blank=True)
    
    def __str__(self):
        return self.title

class Answer(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='answers')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='answers')
    content = models.TextField()
    is_verified_solution = models.BooleanField(default=False)
    validated_by_professor = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer by {self.author.username} to {self.post.title}"

class DisciplineReview(models.Model):
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE, related_name='reviews')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='discipline_reviews')
    rating = models.IntegerField(default=5) # 1 to 5
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.discipline.name} by {self.author.username} ({self.rating}/5)"

