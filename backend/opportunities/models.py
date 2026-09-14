from django.db import models
from django.conf import settings

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date_time = models.DateTimeField()
    location_or_link = models.CharField(max_length=500)
    max_participants = models.IntegerField(default=0)  # 0 means unlimited
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_events')
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='events_participating', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class JobType(models.TextChoices):
    INTERNSHIP = 'INTERNSHIP', 'Estágio'
    JUNIOR = 'JUNIOR', 'Júnior'
    TRAINEE = 'TRAINEE', 'Trainee'
    OTHER = 'OTHER', 'Outro'

class JobPosting(models.Model):
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    job_type = models.CharField(max_length=20, choices=JobType.choices, default=JobType.INTERNSHIP)
    description = models.TextField()
    apply_link = models.URLField(max_length=500)
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='job_postings')
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

class MentorshipStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pendente'
    ACCEPTED = 'ACCEPTED', 'Aceito'
    REJECTED = 'REJECTED', 'Recusado'
    COMPLETED = 'COMPLETED', 'Concluído'

class MentorshipSession(models.Model):
    mentor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentorships_as_mentor')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentorships_as_student')
    topic = models.CharField(max_length=255)
    requested_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=MentorshipStatus.choices, default=MentorshipStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mentorship: {self.student.username} with {self.mentor.username}"
