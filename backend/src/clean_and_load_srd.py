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
from characters.models import Character, Heritage, Ability, Vice, Trauma, Stand

def clean_and_load_srd():
    print("=== CLEANING DATABASE AND LOADING SRD DATA ===\n")
    
    # Keep users (don't delete them)
    users = User.objects.all()
    print(f"Keeping {users.count()} users")
    
    # Keep characters but note they might have invalid references
    characters = Character.objects.all()
    print(f"Found {characters.count()} characters (will need to update heritage references)")
    
    # Keep stands
    stands = Stand.objects.all()
    print(f"Found {stands.count()} stands")
    
    # Delete fake data
    print("\n--- DELETING FAKE DATA ---")
    
    # Delete fake heritage
    fake_heritage = Heritage.objects.filter(name="Passione Ex-Member")
    if fake_heritage.exists():
        fake_heritage.delete()
        print("✓ Deleted fake heritage: Passione Ex-Member")
    
    # Delete fake ability
    fake_ability = Ability.objects.filter(name="Swan Song")
    if fake_ability.exists():
        fake_ability.delete()
        print("✓ Deleted fake ability: Swan Song")
    
    # Delete fake vice
    fake_vice = Vice.objects.filter(name="Fun")
    if fake_vice.exists():
        fake_vice.delete()
        print("✓ Deleted fake vice: Fun")
    
    # Check for any other fake data
    all_heritages = Heritage.objects.all()
    all_abilities = Ability.objects.all()
    all_vices = Vice.objects.all()
    all_traumas = Trauma.objects.all()
    
    print(f"\n--- CURRENT DATA AFTER CLEANUP ---")
    print(f"Heritages: {all_heritages.count()}")
    print(f"Abilities: {all_abilities.count()}")
    print(f"Vices: {all_vices.count()}")
    print(f"Traumas: {all_traumas.count()}")
    
    if all_heritages.count() == 0:
        print("\n--- LOADING SRD FIXTURES ---")
        print("Loading SRD heritages...")
        os.system("python manage.py loaddata srd_heritages.json")
        
        print("Loading SRD abilities...")
        os.system("python manage.py loaddata standard_abilities.json")
        
        print("Loading SRD vices...")
        os.system("python manage.py loaddata srd_vices.json")
        
        print("Loading SRD traumas...")
        os.system("python manage.py loaddata srd_traumas.json")
        
        print("Loading SRD benefits...")
        os.system("python manage.py loaddata srd_benefits.json")
        
        print("Loading SRD detriments...")
        os.system("python manage.py loaddata srd_detriments.json")
        
        print("Loading SRD Hamon abilities...")
        os.system("python manage.py loaddata srd_hamon_abilities.json")
        
        print("Loading SRD Spin abilities...")
        os.system("python manage.py loaddata srd_spin_abilities.json")
    
    # Update character heritage references if needed
    if characters.count() > 0:
        print("\n--- UPDATING CHARACTER REFERENCES ---")
        for char in characters:
            if char.heritage and char.heritage.name == "Passione Ex-Member":
                # Set to Human heritage (most common)
                human_heritage = Heritage.objects.filter(name="Human").first()
                if human_heritage:
                    char.heritage = human_heritage
                    char.save()
                    print(f"✓ Updated {char.true_name}'s heritage to Human")
    
    print("\n=== DATABASE CLEANUP COMPLETE ===")

if __name__ == "__main__":
    clean_and_load_srd() 