# Django Admin Quick Reference

## Game Rules Configuration

### Access Levels

| User Type | Global Rules | Campaign Rules |
|-----------|--------------|----------------|
| **Superuser** | View & Edit | View & Edit |
| **GM** | View Only | Edit Own Campaigns |
| **Regular User** | No Access | No Access |

### Game Rules Admin Interface

#### 1. Character Creation Rules
- **Level 1 Stand Coin Points**: Total points for new characters (default: 10)
- **Level 1 Action Dice**: Total action dice for new characters (default: 7)
- **Max Dice Per Action**: Maximum dice per action rating (default: 4)
- **Max Dice Per Action (Level 1)**: Maximum dice per action at level 1 (default: 2)

#### 2. Advancement XP Costs
- **XP Cost Action Dice**: Cost per action die gained (default: 5)
- **XP Cost Stand Coin Point**: Cost per Stand Coin point gained (default: 10)
- **XP Cost Heritage Point**: Cost per heritage point gained (default: 5)

#### 3. Default Abilities & XP Tracks
- **Default Starting Abilities**: Default abilities for new characters (default: 3)
- **Abilities Per A Grade**: Additional abilities per A-grade Stand stat (default: 2)
- **Default XP Track Size**: Default XP track size (default: 8)
- **XP Track Sizes**: JSON field for per-category XP track sizes

#### 4. Stand Coin Grade Point Costs
- **JSON Format**: `{"S": 5, "A": 4, "B": 3, "C": 2, "D": 1, "F": 0}`
- **Purpose**: Configure how many points each grade costs
- **Affects**: Character creation and advancement

#### 5. Stand Coin Stat Properties
- **Comprehensive Properties**: Power, Speed, Range, Durability, Precision, Development
- **Per Grade**: S, A, B, C, D, F grades each have detailed properties
- **JSON Format**: Complex nested structure with detailed effects

#### 6. Stress Rules
- **Base Stress**: Default stress value (default: 9)
- **Stress Modifiers**: Armor-based stress modifications
- **JSON Format**: Flexible stress rule configuration

### Creating Campaign-Specific Rules

1. **Navigate to**: Django Admin → Characters → Game Rules
2. **Click**: "Add Game Rules"
3. **Set**: `is_global = False`
4. **Select**: Campaign from dropdown
5. **Form will be pre-filled** with global default values
6. **Modify** only the values you want to change
7. **Save** the campaign-specific rules

### Best Practices

#### For Superusers
- Set sensible global defaults that work for most campaigns
- Document any global rule changes
- Test thoroughly before applying global changes
- Backup database before major modifications

#### For GMs
- Start with global defaults (form auto-populates)
- Only change values that need customization
- Test character creation with new rules
- Communicate changes to players

### Common JSON Configurations

#### Stand Coin Grade Points
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

#### XP Track Sizes
```json
{
    "playbook": 8,
    "heritage": 8,
    "prowess": 8,
    "insight": 8,
    "resolve": 8
}
```

#### Stress Rules
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

### Troubleshooting

#### Permission Issues
- **Problem**: Can't edit global rules
- **Solution**: Only superusers can edit global rules. GMs can only edit campaign-specific rules.

#### JSON Validation Errors
- **Problem**: Invalid JSON in configuration fields
- **Solution**: Use valid JSON format with proper quotes and brackets

#### Character Creation Errors
- **Problem**: Characters fail validation with custom rules
- **Solution**: Check that campaign rules are properly configured and don't conflict

#### Missing Default Values
- **Problem**: System can't find default values
- **Solution**: Ensure global rules exist and have all required fields populated

### Quick Commands

#### Check Current Rules
```python
# In Django shell
from characters.models import GameRules
global_rules = GameRules.objects.filter(is_global=True).first()
print(f"Global Stand Coin Points: {global_rules.level_1_stand_coin_points}")
```

#### Create Campaign Rules
```python
# In Django shell
from characters.models import GameRules, Campaign
campaign = Campaign.objects.get(name="My Campaign")
global_rules = GameRules.objects.filter(is_global=True).first()

campaign_rules = GameRules.objects.create(
    campaign=campaign,
    is_global=False,
    level_1_stand_coin_points=global_rules.level_1_stand_coin_points,
    xp_cost_action_dice=3  # Custom value
)
```

#### Update Global Rules
```python
# In Django shell
global_rules = GameRules.objects.filter(is_global=True).first()
global_rules.stand_coin_grade_points = {
    'S': 6, 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1
}
global_rules.save()
```

### Help Messages

The admin interface includes helpful messages for GMs:

- **Global Rules**: Read-only for GMs, provide default values for all campaigns
- **Campaign Rules**: Editable by GMs, override global defaults for specific campaigns
- **Auto-Population**: New campaign rules are pre-filled with global defaults
- **Superuser Only**: Only superusers can modify global rules

### Security Notes

- Global rules are protected from GM modification
- Campaign rules are isolated to specific campaigns
- All changes are logged in Django's admin history
- JSON fields are validated for proper format
- Character validation ensures rule consistency 