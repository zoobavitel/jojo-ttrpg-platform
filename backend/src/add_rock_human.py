#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from characters.models import Heritage

def add_rock_human():
    print("=== ADDING ROCK HUMAN HERITAGE ===\n")
    
    # Check if Rock Human already exists
    existing = Heritage.objects.filter(name="Rock Human").first()
    if existing:
        print("Rock Human heritage already exists!")
        return
    
    # Create Rock Human heritage
    rock_human = Heritage.objects.create(
        name="Rock Human",
        base_hp=2,
        description="Resilient stone-like beings with natural stealth."
    )
    
    print(f"✓ Added Rock Human heritage (ID: {rock_human.id})")
    print(f"  - Name: {rock_human.name}")
    print(f"  - Base HP: {rock_human.base_hp}")
    print(f"  - Description: {rock_human.description}")
    
    # Show all heritages
    print("\n--- ALL HERITAGES ---")
    heritages = Heritage.objects.all()
    for heritage in heritages:
        print(f"  - {heritage.name} (Base HP: {heritage.base_hp})")
    
    print("\n=== ROCK HUMAN ADDED ===")

if __name__ == "__main__":
    add_rock_human() 