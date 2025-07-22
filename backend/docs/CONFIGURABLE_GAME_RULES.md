# Configurable Game Rules System

## Overview

The 1-800-BIZARRE platform now features a comprehensive configurable game rules system that allows administrators and Game Masters (GMs) to customize virtually every aspect of the game mechanics without requiring code changes. This system provides both global defaults and campaign-specific overrides.

## Architecture

### GameRules Model

The `GameRules` model serves as the central configuration hub for all game mechanics:

```python
class GameRules(models.Model):
    # Character Creation Rules
    level_1_stand_coin_points = models.IntegerField(default=10)
    level_1_action_dice = models.IntegerField(default=7)
    max_dice_per_action = models.IntegerField(default=4)
    max_dice_per_action_level_1 = models.IntegerField(default=2)
    
    # Advancement XP Costs
    xp_cost_action_dice = models.IntegerField(default=5)
    xp_cost_stand_coin_point = models.IntegerField(default=10)
    xp_cost_heritage_point = models.IntegerField(default=5)
    
    # Default Abilities and XP Tracks
    default_starting_abilities = models.IntegerField(default=3)
    abilities_per_a_grade = models.IntegerField(default=2)
    default_xp_track_size = models.IntegerField(default=8)
    xp_track_sizes = models.JSONField(default=dict)
    
    # Stand Coin Configuration
    stand_coin_grade_points = models.JSONField(default=dict)
    stand_coin_stat_properties = models.JSONField(default=dict)
    
    # Stress Rules
    stress_rules = models.JSONField(default=dict)
    
    # Campaign Association
    campaign = models.ForeignKey('Campaign', on_delete=models.CASCADE, null=True, blank=True)
    is_global = models.BooleanField(default=True)
```

### Rule Hierarchy

1. **Global Rules** (Default): Provide baseline values for all campaigns
2. **Campaign Rules** (Override): Customize rules for specific campaigns
3. **Character Validation**: Uses campaign-specific rules if available, falls back to global rules

## Configurable Features

### 1. Character Creation Rules

**Configurable Fields:**
- `level_1_stand_coin_points`: Total Stand Coin points for new characters (default: 10)
- `level_1_action_dice`: Total action dice for new characters (default: 7)
- `max_dice_per_action`: Maximum dice per action rating (default: 4)
- `max_dice_per_action_level_1`: Maximum dice per action at level 1 (default: 2)

**Usage:**
```python
game_rules = character._get_game_rules()
total_points = game_rules.level_1_stand_coin_points
max_dice = game_rules.max_dice_per_action_level_1
```

### 2. Advancement XP Costs

**Configurable Fields:**
- `xp_cost_action_dice`: XP cost per action die gained (default: 5)
- `xp_cost_stand_coin_point`: XP cost per Stand Coin point gained (default: 10)
- `xp_cost_heritage_point`: XP cost per heritage point gained (default: 5)

**Usage:**
```python
character.spend_xp_for_action_dice('playbook', 2)  # Uses configurable cost
character.spend_xp_for_stand_coin('heritage', 1)   # Uses configurable cost
```

### 3. Stand Coin Grade Point Costs

**Configurable Field:** `stand_coin_grade_points`

**Default Values:**
```json
{
    "S": 5,
    "A": 4,
    "B": 3,
    "C": 2,
    "D": 1,
    "F": 0
}
```

**Usage:**
```python
grade_points = game_rules.get_grade_points()
s_grade_cost = grade_points['S']  # 5 points
```

### 4. Stand Coin Stat Properties

**Configurable Field:** `stand_coin_stat_properties`

**Comprehensive Properties for Each Grade (S, A, B, C, D, F):**

#### Power Properties
- `harm_level`: Damage level (0-4)
- `force`: Force value (0-4)
- `position_reduction`: Can force position to be lowered (S-grade only)
- `description`: Human-readable description

#### Speed Properties
- `movement`: Base movement distance
- `extended_movement`: Extended movement distance
- `initiative_order`: Turn order (1-6)
- `actions_per_turn`: Number of actions per turn
- `dash_cost`: Cost to dash (0-1 actions)
- `description`: Human-readable description

#### Range Properties
- `base_range`: Base range distance
- `extended_range`: Extended range distance
- `range_penalty`: Penalty for extended range
- `description`: Human-readable description

#### Durability Properties
- `stress_bonus`: Additional stress boxes (-1 to +4)
- `armor_charges`: Number of armor charges (0-3)
- `resistance_bonus`: Resistance roll bonus (1-2)
- `description`: Human-readable description

#### Precision Properties
- `success_threshold`: Success threshold (3-6)
- `critical_success`: Critical success rules
- `critical_fail`: Critical fail rules
- `description`: Human-readable description

#### Development Properties
- `xp_bonus`: XP bonus per session (0-5)
- `temporary_ability_cost`: Cost for temporary abilities
- `temporary_ability_duration`: Duration of temporary abilities
- `description`: Human-readable description

**Usage:**
```python
power_props = character.get_stand_coin_effects('power', 'S')
harm_level = power_props['harm_level']  # 4
xp_bonus = character.get_development_xp_bonus()  # Uses configurable bonus
```

### 5. Default Abilities and XP Tracks

**Configurable Fields:**
- `default_starting_abilities`: Default abilities for new characters (default: 3)
- `abilities_per_a_grade`: Additional abilities per A-grade Stand stat (default: 2)
- `default_xp_track_size`: Default XP track size (default: 8)
- `xp_track_sizes`: JSON field for per-category XP track sizes

**Default XP Track Sizes:**
```json
{
    "playbook": 8,
    "heritage": 8,
    "prowess": 8,
    "insight": 8,
    "resolve": 8
}
```

### 6. Stress Rules

**Configurable Field:** `stress_rules`

**Default Values:**
```json
{
    "base_stress": 9,
    "stress_modifiers": {
        "armor_light": 0,
        "armor_medium": 2,
        "armor_heavy": 4
    }
}
```

## Admin Interface

### Access Control

- **Superusers**: Can view and edit all rules (global and campaign-specific)
- **GMs**: Can view global rules (read-only) and edit their own campaign-specific rules
- **Regular Users**: No access to game rules configuration

### Admin Features

1. **Global Rules**: Provide default values for all campaigns
2. **Campaign Rules**: Override global defaults for specific campaigns
3. **Auto-Population**: New campaign rules are pre-filled with global defaults
4. **Help Messages**: Clear guidance on how the system works

### Admin Interface Sections

1. **Character Creation Rules**
2. **Advancement XP Costs**
3. **Default Abilities & XP Tracks**
4. **Stand Coin Grade Point Costs**
5. **Stand Coin Stat Properties**
6. **Stress Rules**

## API Integration

### Character Model Methods

```python
# Get appropriate game rules for character
game_rules = character._get_game_rules()

# Get Stand Coin effects
power_props = character.get_stand_coin_effects('power', 'S')
speed_props = character.get_stand_coin_effects('speed', 'A')

# Get development XP bonus
xp_bonus = character.get_development_xp_bonus()

# Validate character creation
character._validate_level_1_creation()
```

### GameRules Model Methods

```python
# Get grade point costs
grade_points = game_rules.get_grade_points()

# Get Stand Coin properties
properties = game_rules.get_stand_coin_properties()

# Get specific stat properties
power_props = game_rules.get_power_properties('S')
speed_props = game_rules.get_speed_properties('A')
```

## Migration and Setup

### Initial Setup

```bash
# Run migrations
python manage.py makemigrations characters
python manage.py migrate

# Set up default global rules
python manage.py shell
>>> from characters.models import GameRules
>>> GameRules.objects.create(is_global=True)
```

### Updating Existing Rules

```python
# Update global rules with new defaults
from characters.models import GameRules

global_rules = GameRules.objects.filter(is_global=True).first()
if global_rules:
    global_rules.stand_coin_grade_points = {
        'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0
    }
    global_rules.save()
```

## Best Practices

### For Superusers (System Administrators)

1. **Set Sensible Global Defaults**: Configure global rules to work well for most campaigns
2. **Document Changes**: Keep track of global rule changes
3. **Test Thoroughly**: Verify that rule changes don't break existing characters
4. **Backup Before Major Changes**: Always backup the database before significant rule modifications

### For GMs (Game Masters)

1. **Start with Global Defaults**: Use campaign-specific rules only when necessary
2. **Communicate Changes**: Inform players of campaign-specific rule changes
3. **Test Character Creation**: Verify that new characters work with custom rules
4. **Consider Balance**: Ensure custom rules don't create overpowered or underpowered characters

### For Developers

1. **Use Configurable Values**: Always use `game_rules.get_*()` methods instead of hardcoded values
2. **Add Validation**: Include validation for new configurable fields
3. **Update Documentation**: Keep this documentation current with new features
4. **Test Edge Cases**: Ensure the system handles missing or invalid configuration gracefully

## Examples

### Creating Campaign-Specific Rules

```python
# Create campaign-specific rules that inherit from global defaults
from characters.models import GameRules, Campaign

campaign = Campaign.objects.get(name="My Custom Campaign")
global_rules = GameRules.objects.filter(is_global=True).first()

campaign_rules = GameRules.objects.create(
    campaign=campaign,
    is_global=False,
    # Inherit most values from global rules
    level_1_stand_coin_points=global_rules.level_1_stand_coin_points,
    # Customize specific values
    xp_cost_action_dice=3,  # Cheaper action dice
    stand_coin_grade_points={
        'S': 6, 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1  # More expensive grades
    }
)
```

### Custom Stand Coin Properties

```python
# Custom Stand Coin properties for a high-powered campaign
custom_properties = {
    'S': {
        'stress': 15,
        'power': {
            'harm_level': 5,
            'force': 5,
            'position_reduction': True,
            'description': 'Ultimate power level'
        },
        'speed': {
            'movement': 300,
            'initiative_order': 1,
            'actions_per_turn': 5,
            'dash_cost': 0,
            'description': 'Ultimate speed'
        }
        # ... other properties
    }
    # ... other grades
}

campaign_rules.stand_coin_stat_properties = custom_properties
campaign_rules.save()
```

## Troubleshooting

### Common Issues

1. **Character Validation Errors**: Check that campaign rules are properly configured
2. **Missing Default Values**: Ensure global rules exist and have all required fields
3. **Permission Errors**: Verify user has appropriate permissions for rule editing
4. **JSON Field Errors**: Ensure JSON fields contain valid JSON data

### Debugging

```python
# Check current game rules for a character
character = Character.objects.get(id=1)
game_rules = character._get_game_rules()
print(f"Using rules: {game_rules}")
print(f"Stand Coin points: {game_rules.level_1_stand_coin_points}")

# Check Stand Coin properties
properties = game_rules.get_stand_coin_properties()
print(f"S-grade properties: {properties.get('S', {})}")
```

## Future Enhancements

### Planned Features

1. **Rule Templates**: Pre-configured rule sets for different game styles
2. **Rule Versioning**: Track changes to rules over time
3. **Rule Import/Export**: Share rule configurations between campaigns
4. **Rule Validation**: Automated validation of rule configurations
5. **Rule Analytics**: Track how different rules affect gameplay

### Extension Points

The system is designed to be easily extensible:

1. **New Configurable Fields**: Add new fields to the GameRules model
2. **New Validation Rules**: Extend character validation methods
3. **New Admin Sections**: Add new fieldsets to the admin interface
4. **New API Endpoints**: Expose rule configuration via API

## Conclusion

The configurable game rules system provides unprecedented flexibility for customizing the 1-800-BIZARRE platform while maintaining consistency and balance. By separating global defaults from campaign-specific overrides, the system supports both standardized play and creative customization.

This system empowers GMs to create unique gaming experiences while ensuring that the core game mechanics remain stable and well-tested. 