# Backend Changelog

## [2025-01-21] - Configurable Game Rules System

### 🎉 Major Features Added

#### Configurable Game Rules System
- **Complete Game Rules Configuration**: Added comprehensive configurable game rules system allowing admins and GMs to customize all game mechanics without code changes
- **Global vs Campaign-Specific Rules**: Implemented rule hierarchy with global defaults and campaign-specific overrides
- **Admin Interface**: Enhanced Django admin with user-friendly configuration interface

#### Stand Coin System Enhancements
- **Configurable Grade Point Costs**: Made Stand Coin grade point costs (S=5, A=4, B=3, C=2, D=1, F=0) fully configurable
- **Comprehensive Stat Properties**: Added detailed configurable properties for all Stand Coin stats (Power, Speed, Range, Durability, Precision, Development)
- **Detailed Effects**: Each grade now has configurable effects including harm levels, movement, range, armor, success thresholds, and XP bonuses

#### Character Creation & Advancement
- **Configurable Character Creation**: Made all character creation rules configurable (Stand Coin points, action dice, abilities)
- **Configurable XP Costs**: Made all advancement XP costs configurable (action dice, Stand Coin points, heritage points)
- **Configurable XP Tracks**: Made XP track sizes configurable per category

### 🔧 Technical Improvements

#### Database Schema
- **New Fields Added**:
  - `GameRules.stand_coin_grade_points` (JSONField)
  - `GameRules.stand_coin_stat_properties` (JSONField) - Enhanced with comprehensive properties
  - `GameRules.xp_cost_action_dice` (IntegerField)
  - `GameRules.xp_cost_stand_coin_point` (IntegerField)
  - `GameRules.xp_cost_heritage_point` (IntegerField)
  - `GameRules.default_starting_abilities` (IntegerField)
  - `GameRules.abilities_per_a_grade` (IntegerField)
  - `GameRules.default_xp_track_size` (IntegerField)
  - `GameRules.xp_track_sizes` (JSONField)

#### Model Methods
- **GameRules Model**:
  - `get_default_grade_points()`: Returns default grade point costs
  - `get_grade_points()`: Returns configurable grade point costs
  - `get_power_properties(grade)`: Returns power properties for a grade
  - `get_speed_properties(grade)`: Returns speed properties for a grade
  - `get_range_properties(grade)`: Returns range properties for a grade
  - `get_durability_properties(grade)`: Returns durability properties for a grade
  - `get_precision_properties(grade)`: Returns precision properties for a grade
  - `get_development_properties(grade)`: Returns development properties for a grade

- **Character Model**:
  - `get_stand_coin_effects(stat_name, grade)`: Returns effects of a specific Stand Coin stat
  - `get_development_xp_bonus()`: Returns XP bonus from Development Potential
  - Enhanced validation methods to use configurable rules

#### Admin Interface
- **Access Control**: Implemented proper permissions (superusers can edit global rules, GMs can only edit campaign-specific rules)
- **Auto-Population**: New campaign rules are pre-filled with global defaults
- **Help Messages**: Added helpful guidance for GMs
- **Form Customization**: Enhanced forms with proper initial values

### 📚 Documentation

#### New Documentation Files
- **`docs/CONFIGURABLE_GAME_RULES.md`**: Comprehensive documentation of the configurable game rules system
- **`docs/ADMIN_QUICK_REFERENCE.md`**: Quick reference guide for the Django admin interface
- **`docs/CHANGELOG.md`**: This changelog documenting all changes

#### Updated Documentation
- **`backend/README.md`**: Updated to reference new documentation and features

### 🔒 Security & Permissions

#### Access Control
- **Global Rules**: Read-only for GMs, editable only by superusers
- **Campaign Rules**: Editable by GMs for their own campaigns
- **Validation**: All rule changes are validated and logged

#### Data Integrity
- **JSON Validation**: All JSON fields are validated for proper format
- **Character Validation**: Enhanced character validation to use configurable rules
- **Fallback Values**: System gracefully handles missing configuration with sensible defaults

### 🚀 Migration & Setup

#### Database Migrations
- **Migration 0009**: Added `stand_coin_grade_points` field to GameRules model
- **Data Migration**: Updated existing game rules with comprehensive Stand Coin properties

#### Setup Scripts
- **`setup_default_game_rules.py`**: Updated to include new configurable fields
- **Auto-Population**: Existing game rules automatically updated with new defaults

### 🎯 Default Values

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

#### Stand Coin Stat Properties
- **S Grade**: Exceptional (13 stress, level 4 harm, 200ft movement, unlimited range, +4 stress bonus, 3 armor charges)
- **A Grade**: Elite (12 stress, level 4 harm, 60ft movement, 100ft range, +3 stress bonus, 3 armor charges)
- **B Grade**: Skilled (11 stress, level 3 harm, 40ft movement, 50ft range, +2 stress bonus, 2 armor charges)
- **C Grade**: Average (10 stress, level 2 harm, 35ft movement, 40ft range, +1 stress bonus, 1 armor charge)
- **D Grade**: Below Average (9 stress, level 1 harm, 30ft movement, 20ft range, 0 stress bonus, 1 armor charge)
- **F Grade**: Flawed (8 stress, level 0 harm, 25ft movement, 10ft range, -1 stress bonus, 0 armor charges)

#### Advancement XP Costs
- **Action Dice**: 5 XP per die
- **Stand Coin Points**: 10 XP per point
- **Heritage Points**: 5 XP per point

#### Character Creation Rules
- **Level 1 Stand Coin Points**: 10
- **Level 1 Action Dice**: 7
- **Default Starting Abilities**: 3
- **Abilities Per A Grade**: 2
- **Default XP Track Size**: 8

### 🔄 Backward Compatibility

#### Existing Characters
- All existing characters continue to work with the new system
- Character validation now uses configurable rules
- No data migration required for existing characters

#### Existing Campaigns
- Campaigns without specific rules automatically use global defaults
- Campaigns with existing rules continue to work as before
- New campaign rules can be created to override global defaults

### 🧪 Testing

#### Validation Testing
- Character creation validation tested with various rule configurations
- Stand Coin point validation tested with custom grade costs
- XP advancement validation tested with custom costs
- Admin interface permissions tested for all user types

#### Edge Case Testing
- Missing global rules handled gracefully
- Invalid JSON configurations properly validated
- Campaign-specific rules properly override global defaults
- Character validation works with all rule combinations

### 🎮 Game Balance

#### Default Balance
- Default values maintain the original game balance
- All configurable values can be adjusted for different play styles
- System supports both balanced and high-powered campaigns

#### Customization Examples
- **High-Powered Campaign**: Increased Stand Coin points, reduced XP costs
- **Low-Powered Campaign**: Reduced Stand Coin points, increased XP costs
- **Balanced Campaign**: Use default values with minor adjustments

### 🔮 Future Enhancements

#### Planned Features
- **Rule Templates**: Pre-configured rule sets for different game styles
- **Rule Versioning**: Track changes to rules over time
- **Rule Import/Export**: Share rule configurations between campaigns
- **Rule Analytics**: Track how different rules affect gameplay

#### Extension Points
- **New Configurable Fields**: Easy to add new configurable game mechanics
- **New Validation Rules**: Extensible character validation system
- **New Admin Sections**: Modular admin interface design
- **API Endpoints**: Ready for exposing rule configuration via API

---

## Previous Versions

### [2025-01-20] - Initial Backend Setup
- Basic Django project structure
- Character, Campaign, and Stand models
- Basic admin interface
- Authentication system
- Initial API endpoints

---

*This changelog documents all significant changes to the backend system. For detailed technical information, see the individual documentation files.* 