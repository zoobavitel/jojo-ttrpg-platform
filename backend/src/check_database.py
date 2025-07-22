#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from django.contrib.auth.models import User
from characters.models import (
    Character, Campaign, NPC, Heritage, Ability, Vice, Trauma, 
    Stand, Session, ProgressClock, ExperienceTracker, DowntimeActivity,
    Score, ChatMessage, XPHistory, StressHistory, SessionEvent
)

def check_database_contents():
    print("=== DATABASE CONTENTS OVERVIEW ===\n")
    
    # Check Users
    users = User.objects.all()
    print(f"USERS: {users.count()} total")
    for user in users:
        print(f"  - {user.username} (ID: {user.id}) - {'Active' if user.is_active else 'Inactive'}")
    print()
    
    # Check Characters
    characters = Character.objects.all()
    print(f"CHARACTERS: {characters.count()} total")
    for char in characters:
        print(f"  - {char.true_name} (ID: {char.id}) - Playbook: {char.playbook} - User: {char.user.username if char.user else 'None'}")
    print()
    
    # Check Stands
    stands = Stand.objects.all()
    print(f"STANDS: {stands.count()} total")
    for stand in stands:
        print(f"  - {stand.name} (ID: {stand.id}) - Character: {stand.character.true_name if stand.character else 'None'}")
    print()
    
    # Check Campaigns
    campaigns = Campaign.objects.all()
    print(f"CAMPAIGNS: {campaigns.count()} total")
    for campaign in campaigns:
        print(f"  - {campaign.name} (ID: {campaign.id}) - GM: {campaign.gm.username if campaign.gm else 'None'}")
    print()
    
    # Check Sessions
    sessions = Session.objects.all()
    print(f"SESSIONS: {sessions.count()} total")
    for session in sessions:
        print(f"  - {session.name} (ID: {session.id}) - Campaign: {session.campaign.name if session.campaign else 'None'} - Status: {session.status}")
    print()
    
    # Check NPCs
    npcs = NPC.objects.all()
    print(f"NPCs: {npcs.count()} total")
    for npc in npcs:
        print(f"  - {npc.name} (ID: {npc.id}) - Campaign: {npc.campaign.name if npc.campaign else 'None'}")
    print()
    
    # Check Heritages
    heritages = Heritage.objects.all()
    print(f"HERITAGES: {heritages.count()} total")
    for heritage in heritages:
        print(f"  - {heritage.name} (ID: {heritage.id})")
    print()
    
    # Check Abilities
    abilities = Ability.objects.all()
    print(f"ABILITIES: {abilities.count()} total")
    for ability in abilities:
        print(f"  - {ability.name} (ID: {ability.id}) - Type: {ability.type}")
    print()
    
    # Check Vices
    vices = Vice.objects.all()
    print(f"VICES: {vices.count()} total")
    for vice in vices:
        print(f"  - {vice.name} (ID: {vice.id})")
    print()
    
    # Check Traumas
    traumas = Trauma.objects.all()
    print(f"TRAUMAS: {traumas.count()} total")
    for trauma in traumas:
        print(f"  - {trauma.name} (ID: {trauma.id})")
    print()
    
    # Check Progress Clocks
    clocks = ProgressClock.objects.all()
    print(f"PROGRESS CLOCKS: {clocks.count()} total")
    for clock in clocks:
        print(f"  - {clock.name} (ID: {clock.id}) - Type: {clock.clock_type} - Progress: {clock.filled_segments}/{clock.max_segments}")
    print()
    
    # Check Experience Trackers
    xp_trackers = ExperienceTracker.objects.all()
    print(f"EXPERIENCE TRACKERS: {xp_trackers.count()} total")
    for tracker in xp_trackers:
        print(f"  - Character: {tracker.character.true_name} - XP: {tracker.xp_gained} - Trigger: {tracker.trigger}")
    print()
    
    # Check Downtime Activities
    downtime = DowntimeActivity.objects.all()
    print(f"DOWNTIME ACTIVITIES: {downtime.count()} total")
    for activity in downtime:
        print(f"  - Character: {activity.character.true_name} - Type: {activity.activity_type}")
    print()
    
    # Check Scores
    scores = Score.objects.all()
    print(f"SCORES: {scores.count()} total")
    for score in scores:
        print(f"  - {score.name} (ID: {score.id}) - Type: {score.score_type} - Completed: {score.completed}")
    print()
    
    # Check Chat Messages
    messages = ChatMessage.objects.all()
    print(f"CHAT MESSAGES: {messages.count()} total")
    for msg in messages:
        print(f"  - {msg.sender.username}: {msg.message[:50]}...")
    print()

if __name__ == "__main__":
    check_database_contents() 