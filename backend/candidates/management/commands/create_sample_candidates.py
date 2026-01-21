"""
Management command to create sample candidates for testing.
"""
from django.core.management.base import BaseCommand
from candidates.models import Candidate


class Command(BaseCommand):
    help = 'Creates sample candidates for the voting platform'

    def handle(self, *args, **options):
        # Check if candidates already exist
        if Candidate.objects.exists():
            self.stdout.write(
                self.style.WARNING('Candidates already exist. Skipping creation.')
            )
            return

        # Create Candidate 1
        candidate1 = Candidate.objects.create(
            name='John Doe',
            linkedin_url='https://www.linkedin.com/in/johndoe/',
            team_id=1
        )
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created candidate: {candidate1.name}')
        )

        # Create Candidate 2
        candidate2 = Candidate.objects.create(
            name='Jane Smith',
            linkedin_url='',
            team_id=2
        )
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created candidate: {candidate2.name}')
        )

        self.stdout.write(
            self.style.SUCCESS('\nSample candidates created successfully!')
        )

