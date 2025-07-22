#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from characters.models import Heritage, Ability, Vice, Trauma

def fix_srd_data():
    print("=== FIXING SRD DATA TO MATCH CORE SRD ===\n")
    
    # Fix heritages to match core SRD
    print("--- FIXING HERITAGES ---")
    
    # Remove duplicate and non-core heritages
    non_core_heritages = Heritage.objects.filter(
        name__in=['Pillar Man', 'Gray Matter', 'Haunting', 'Cyborg', 'Oracle']
    )
    for heritage in non_core_heritages:
        print(f"Removing non-core heritage: {heritage.name}")
        heritage.delete()
    
    # Update core heritages to match SRD
    human = Heritage.objects.filter(name="Human").first()
    if human:
        human.base_hp = 0
        human.description = "Versatile but without inherent supernatural abilities."
        human.save()
        print("✓ Updated Human heritage")
    
    rock_human = Heritage.objects.filter(name="Rock Human").first()
    if rock_human:
        rock_human.base_hp = 2
        rock_human.description = "Resilient stone-like beings with natural stealth."
        rock_human.save()
        print("✓ Updated Rock Human heritage")
    
    vampire = Heritage.objects.filter(name="Vampire").first()
    if vampire:
        vampire.base_hp = 2  # Fix from 3 to 2 as per SRD
        vampire.description = "Immortal predators vulnerable to sunlight and Hamon."
        vampire.save()
        print("✓ Updated Vampire heritage")
    
    # Fix ability types
    print("\n--- FIXING ABILITY TYPES ---")
    abilities = Ability.objects.all()
    for ability in abilities:
        if not ability.type:
            ability.type = "standard"
            ability.save()
            print(f"✓ Fixed type for ability: {ability.name}")
    
    # Remove non-SRD abilities
    non_srd_abilities = [
        "I, Giorno Giovanna, have a dream…",
        "Swan Song"
    ]
    
    for ability_name in non_srd_abilities:
        ability = Ability.objects.filter(name=ability_name).first()
        if ability:
            print(f"Removing non-SRD ability: {ability_name}")
            ability.delete()
    
    print("\n--- FINAL SRD DATA STATUS ---")
    heritages = Heritage.objects.all()
    abilities = Ability.objects.all()
    vices = Vice.objects.all()
    traumas = Trauma.objects.all()
    
    print(f"Heritages: {heritages.count()}")
    for heritage in heritages:
        print(f"  - {heritage.name} (Base HP: {heritage.base_hp})")
    
    print(f"\nAbilities: {abilities.count()}")
    print(f"Vices: {vices.count()}")
    print(f"Traumas: {traumas.count()}")
    
    print("\n=== SRD DATA FIXED ===")

if __name__ == "__main__":
    fix_srd_data() 