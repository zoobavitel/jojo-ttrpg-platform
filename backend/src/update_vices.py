#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from characters.models import Vice

def update_vices():
    print("=== UPDATING VICES TO 1-800-BIZARRE STANDARD ===\n")
    
    # New vices list from 1-800-BIZARRE
    new_vices = [
        "Gambling",
        "Obsession", 
        "Violence",
        "Pleasure",
        "Stupor",
        "Weird",
        "Obligation",
        "Faith",
        "Luxury",
        "Art",
        "Competition",
        "Power",
        "Adventure",
        "Solitude",
        "Justice"
    ]
    
    # Remove existing vices
    existing_vices = Vice.objects.all()
    print(f"Removing {existing_vices.count()} existing vices...")
    existing_vices.delete()
    
    # Add new vices
    print(f"\nAdding {len(new_vices)} new vices...")
    for i, vice_name in enumerate(new_vices, 1):
        vice = Vice.objects.create(
            name=vice_name,
            description=f"Your character is drawn to {vice_name.lower()}."
        )
        print(f"✓ Added {vice_name} (ID: {vice.id})")
    
    # Show final count
    final_count = Vice.objects.count()
    print(f"\n--- FINAL VICES ({final_count} total) ---")
    for vice in Vice.objects.all():
        print(f"  - {vice.name}")
    
    print("\n=== VICES UPDATED ===")

if __name__ == "__main__":
    update_vices() 