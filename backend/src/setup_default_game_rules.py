#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from characters.models import GameRules

def setup_default_game_rules():
    print("=== SETTING UP DEFAULT GAME RULES ===\n")
    
    # Check if global rules already exist
    existing_global = GameRules.objects.filter(is_global=True).first()
    if existing_global:
        print("Global game rules already exist!")
        return existing_global
    
    # Create default global game rules
    default_grade_points = {
        'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0
    }
    
    default_stand_coin_properties = {
        'S': {'stress': 13, 'description': 'Exceptional'},
        'A': {'stress': 12, 'description': 'Elite'},
        'B': {'stress': 11, 'description': 'Skilled'},
        'C': {'stress': 10, 'description': 'Average'},
        'D': {'stress': 9, 'description': 'Below Average'},
        'F': {'stress': 8, 'description': 'Flawed'}
    }
    
    default_stress_rules = {
        'base_stress': 9,
        'stress_modifiers': {
            'armor_light': 0,
            'armor_medium': 2,
            'armor_heavy': 4
        }
    }
    
    default_xp_track_sizes = {
        'playbook': 8,
        'heritage': 8,
        'prowess': 8,
        'insight': 8,
        'resolve': 8
    }
    
    global_rules = GameRules.objects.create(
        is_global=True,
        level_1_stand_coin_points=10,
        level_1_action_dice=7,
        max_dice_per_action=4,
        max_dice_per_action_level_1=2,
        xp_cost_action_dice=5,
        xp_cost_stand_coin_point=10,
        xp_cost_heritage_point=5,
        default_starting_abilities=3,
        abilities_per_a_grade=2,
        default_xp_track_size=8,
        xp_track_sizes=default_xp_track_sizes,
        stand_coin_grade_points=default_grade_points,
        stand_coin_stat_properties=default_stand_coin_properties,
        stress_rules=default_stress_rules
    )
    
    print("✓ Created default global game rules:")
    print(f"  - Level 1 Stand Coin Points: {global_rules.level_1_stand_coin_points}")
    print(f"  - Level 1 Action Dice: {global_rules.level_1_action_dice}")
    print(f"  - Max Dice Per Action: {global_rules.max_dice_per_action}")
    print(f"  - Max Dice Per Action (Level 1): {global_rules.max_dice_per_action_level_1}")
    print(f"  - Stand Coin Properties: {len(global_rules.stand_coin_stat_properties)} grades configured")
    
    return global_rules

if __name__ == "__main__":
    setup_default_game_rules() 