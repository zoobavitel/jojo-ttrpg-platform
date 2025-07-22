from django.contrib import admin
from django.contrib.auth.models import User
from django.db.models import Q
from django.db import models
from .models import (
    Heritage, Benefit, Detriment,
    Character, Vice, Ability, Stand, StandAbility,
    Campaign, Crew, NPC, Trauma,
    HamonAbility, SpinAbility, CharacterHamonAbility, CharacterSpinAbility,
    ProgressClock, ExperienceTracker, DowntimeActivity, Score, Session,
    ChatMessage, XPHistory, StressHistory, SessionEvent, GameRules
)

# Base admin class for GM-restricted access
class GMAdminMixin:
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # For GMs, only show data from their campaigns
        return qs.filter(campaign__gm=request.user)

    def has_add_permission(self, request):
        if request.user.is_superuser:
            return True
        # GMs can add new entries to their campaigns
        return True

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        # GMs can edit entries from their campaigns
        if obj is None:
            return True
        return obj.campaign.gm == request.user

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        # GMs can delete entries from their campaigns
        if obj is None:
            return True
        return obj.campaign.gm == request.user

    def has_view_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        # GMs can view entries from their campaigns
        if obj is None:
            return True
        return obj.campaign.gm == request.user

# Inline editing for Benefits and Detriments on Heritage admin
class BenefitInline(admin.TabularInline):
    model = Benefit
    extra = 1
    fields = ('name', 'hp_cost', 'required', 'description')

class DetrimentInline(admin.TabularInline):
    model = Detriment
    extra = 1
    fields = ('name', 'hp_value', 'required', 'description')

@admin.register(Heritage)
class HeritageAdmin(admin.ModelAdmin):
    list_display = ('name', 'base_hp', 'description')
    list_editable = ('base_hp',)
    search_fields = ('name', 'description')
    inlines = [BenefitInline, DetrimentInline]
    fieldsets = (
        (None, {
            'fields': ('name', 'base_hp', 'description')
        }),
    )

@admin.register(Benefit)
class BenefitAdmin(admin.ModelAdmin):
    list_display = ('name', 'heritage', 'hp_cost', 'required')
    list_filter = ('heritage', 'required')
    search_fields = ('name', 'description')
    list_editable = ('hp_cost', 'required')

@admin.register(Detriment)
class DetrimentAdmin(admin.ModelAdmin):
    list_display = ('name', 'heritage', 'hp_value', 'required')
    list_filter = ('heritage', 'required')
    search_fields = ('name', 'description')
    list_editable = ('hp_value', 'required')

@admin.register(Ability)
class AbilityAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'description')
    list_filter = ('type',)
    search_fields = ('name', 'description')
    list_editable = ('type',)

@admin.register(Vice)
class ViceAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')

@admin.register(Trauma)
class TraumaAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')

@admin.register(HamonAbility)
class HamonAbilityAdmin(admin.ModelAdmin):
    list_display = ('name', 'hamon_type', 'stress_cost', 'frequency')
    list_filter = ('hamon_type',)
    search_fields = ('name', 'description')
    list_editable = ('stress_cost', 'frequency')

@admin.register(SpinAbility)
class SpinAbilityAdmin(admin.ModelAdmin):
    list_display = ('name', 'spin_type', 'stress_cost', 'frequency')
    list_filter = ('spin_type',)
    search_fields = ('name', 'description')
    list_editable = ('stress_cost', 'frequency')

class StandAbilityInline(admin.TabularInline):
    model = StandAbility
    extra = 1

@admin.register(Stand)
class StandAdmin(GMAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'character', 'type', 'form', 'power', 'speed', 'range', 'durability', 'precision', 'development')
    list_filter = ('type', 'form', 'consciousness_level')
    search_fields = ('name', 'character__true_name')
    inlines = [StandAbilityInline]
    fieldsets = (
        (None, {
            'fields': ('character', 'name', 'type', 'form', 'consciousness_level')
        }),
        ('Stand Coin Stats', {
            'fields': ('power', 'speed', 'range', 'durability', 'precision', 'development')
        }),
        ('Combat', {
            'fields': ('armor', 'standard_ability')
        }),
    )

@admin.register(Character)
class CharacterAdmin(GMAdminMixin, admin.ModelAdmin):
    list_display = ('true_name', 'user', 'heritage', 'campaign', 'crew', 'playbook', 'level')
    list_filter = ('playbook', 'heritage', 'campaign', 'crew')
    search_fields = ('true_name', 'alias', 'user__username')
    filter_horizontal = ('selected_benefits', 'selected_detriments', 'standard_abilities')
    fieldsets = (
        (None, {
            'fields': (
                'user', 'true_name', 'alias',
                'campaign', 'crew', 'heritage', 'vice'
            )
        }),
        ('Background', {
            'fields': ('background_note', 'background_note2')
        }),
        ('Stats', {
            'fields': ('action_dots', 'coin_stats', 'bonus_hp_from_xp', 'level')
        }),
        ('Supernatural', {
            'fields': (
                'playbook',
                'stand_type', 'stand_name', 'stand_form', 'stand_conscious',
                'custom_ability_description', 'custom_ability_type', 'armor_type'
            )
        }),
        ('Abilities', {
            'fields': ('standard_abilities', 'extra_custom_abilities', 'development_temporary_ability')
        }),
        ('Heritage Choices', {
            'fields': ('selected_benefits', 'selected_detriments')
        }),
        ('Relationships', {
            'fields': ('close_friend', 'rival')
        }),
        ('Appearance & Loadout', {
            'fields': ('appearance', 'loadout', 'image')
        }),
        ('Game State', {
            'fields': (
                'stress', 'trauma',
                'healing_clock_segments', 'healing_clock_filled',
                'light_armor_used', 'medium_armor_used', 'heavy_armor_used',
                'harm_level1_used', 'harm_level1_name',
                'harm_level2_used', 'harm_level2_name',
                'harm_level3_used', 'harm_level3_name',
                'harm_level4_used', 'harm_level4_name',
                'xp_clocks', 'total_xp_spent'
            )
        }),
        ('GM Settings', {
            'fields': ('gm_character_locked', 'gm_allowed_edit_fields', 'gm_can_have_s_rank_stand_stats', 'gm_locked_fields')
        }),
    )

@admin.register(NPC)
class NPCAdmin(GMAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'campaign', 'creator', 'playbook', 'level', 'harm_clock_current', 'vulnerability_clock_current', 'armor_charges')
    list_filter = ('playbook', 'campaign', 'creator', 'level')
    search_fields = ('name', 'description', 'stand_description')
    fieldsets = (
        (None, {
            'fields': ('name', 'level', 'creator', 'campaign')
        }),
        ('Appearance & Role', {
            'fields': ('appearance', 'role', 'description')
        }),
        ('Narrative Elements', {
            'fields': ('weakness', 'need', 'desire', 'rumour', 'secret', 'passion')
        }),
        ('Game Mechanics', {
            'fields': ('heritage', 'playbook', 'stand_coin_stats', 'custom_abilities', 'relationships')
        }),
        ('Clocks & Armor', {
            'fields': ('harm_clock_current', 'harm_clock_max', 'vulnerability_clock_current', 'armor_charges')
        }),
        ('Stand Description', {
            'fields': ('stand_description', 'stand_appearance', 'stand_manifestation', 'special_traits', 'stand_name')
        }),
        ('Additional Details', {
            'fields': ('purveyor', 'notes', 'items', 'contacts', 'faction_status', 'inventory')
        }),
    )

@admin.register(GameRules)
class GameRulesAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'level_1_stand_coin_points', 'level_1_action_dice', 'max_dice_per_action', 'max_dice_per_action_level_1', 'is_global')
    list_filter = ('is_global',)
    search_fields = ('campaign__name',)
    
    def changelist_view(self, request, extra_context=None):
        """Add helpful message about how the system works."""
        extra_context = extra_context or {}
        
        if not request.user.is_superuser:
            extra_context['help_message'] = (
                "💡 <strong>How Game Rules Work:</strong><br>"
                "• <strong>Global Rules</strong> (read-only for GMs): Provide default values for all campaigns<br>"
                "• <strong>Campaign Rules</strong> (editable by GMs): Override global defaults for specific campaigns<br>"
                "• When creating campaign rules, they will be pre-filled with global defaults<br>"
                "• Only superusers can modify global rules"
            )
        
        return super().changelist_view(request, extra_context)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # For GMs, only show global rules and their campaign-specific rules
        return qs.filter(
            models.Q(is_global=True) | 
            models.Q(campaign__gm=request.user)
        )
    
    def has_add_permission(self, request):
        if request.user.is_superuser:
            return True
        # GMs can create campaign-specific rules
        return True
    
    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        # GMs can only edit their campaign-specific rules, not global rules
        if obj is None:
            return True
        return not obj.is_global and obj.campaign.gm == request.user
    
    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        # GMs can delete their campaign-specific rules but not global rules
        if obj is None:
            return True
        return not obj.is_global and obj.campaign.gm == request.user
    
    fieldsets = (
        (None, {
            'fields': ('is_global', 'campaign')
        }),
        ('Character Creation Rules', {
            'fields': ('level_1_stand_coin_points', 'level_1_action_dice', 'max_dice_per_action', 'max_dice_per_action_level_1')
        }),
        ('Advancement XP Costs', {
            'fields': ('xp_cost_action_dice', 'xp_cost_stand_coin_point', 'xp_cost_heritage_point'),
            'description': 'Configure how much XP each advancement costs'
        }),
        ('Default Abilities & XP Tracks', {
            'fields': ('default_starting_abilities', 'abilities_per_a_grade', 'default_xp_track_size', 'xp_track_sizes'),
            'description': 'Configure default abilities and XP track sizes'
        }),
        ('Stand Coin Grade Point Costs', {
            'fields': ('stand_coin_grade_points',),
            'description': 'Configure how many Stand Coin points each grade costs. Example: {"S": 5, "A": 4, "B": 3, "C": 2, "D": 1, "F": 0}. This affects character creation and advancement.'
        }),
        ('Stand Coin Stat Properties', {
            'fields': ('stand_coin_stat_properties',),
            'description': 'Configure comprehensive properties for each Stand Coin stat grade (S, A, B, C, D, F). Includes power, speed, range, durability, precision, and development effects. Each grade can have detailed properties for harm levels, movement, range, armor, success thresholds, and XP bonuses.'
        }),
        ('Stress Rules', {
            'fields': ('stress_rules',),
            'description': 'Additional stress rules and modifications'
        }),
    )
    
    def get_form(self, request, obj=None, **kwargs):
        """Customize the form to help GMs create campaign-specific rules."""
        form = super().get_form(request, obj, **kwargs)
        
        # If creating a new campaign-specific rule, populate with global defaults
        if obj is None and not request.user.is_superuser:
            global_rules = GameRules.objects.filter(is_global=True).first()
            if global_rules:
                # Set initial values from global rules
                form.base_fields['level_1_stand_coin_points'].initial = global_rules.level_1_stand_coin_points
                form.base_fields['level_1_action_dice'].initial = global_rules.level_1_action_dice
                form.base_fields['max_dice_per_action'].initial = global_rules.max_dice_per_action
                form.base_fields['max_dice_per_action_level_1'].initial = global_rules.max_dice_per_action_level_1
                form.base_fields['xp_cost_action_dice'].initial = global_rules.xp_cost_action_dice
                form.base_fields['xp_cost_stand_coin_point'].initial = global_rules.xp_cost_stand_coin_point
                form.base_fields['xp_cost_heritage_point'].initial = global_rules.xp_cost_heritage_point
                form.base_fields['default_starting_abilities'].initial = global_rules.default_starting_abilities
                form.base_fields['abilities_per_a_grade'].initial = global_rules.abilities_per_a_grade
                form.base_fields['default_xp_track_size'].initial = global_rules.default_xp_track_size
                form.base_fields['xp_track_sizes'].initial = global_rules.xp_track_sizes
                form.base_fields['stand_coin_grade_points'].initial = global_rules.stand_coin_grade_points
                form.base_fields['stand_coin_stat_properties'].initial = global_rules.stand_coin_stat_properties
                form.base_fields['stress_rules'].initial = global_rules.stress_rules
                form.base_fields['is_global'].initial = False
        
        return form
    
    def changeform_view(self, request, object_id=None, form_url='', extra_context=None):
        """Add extra context for the change form."""
        extra_context = extra_context or {}
        extra_context['show_extra_template'] = True
        return super().changeform_view(request, object_id, form_url, extra_context)

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'gm', 'wanted_stars', 'active_session')
    list_filter = ('gm',)
    search_fields = ('name', 'description')
    filter_horizontal = ('players',)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # For GMs, only show their own campaigns
        return qs.filter(gm=request.user)

    def has_add_permission(self, request):
        if request.user.is_superuser:
            return True
        # GMs can create campaigns
        return True

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        # GMs can edit their own campaigns
        if obj is None:
            return True
        return obj.gm == request.user

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        # GMs can delete their own campaigns
        if obj is None:
            return True
        return obj.gm == request.user

@admin.register(Crew)
class CrewAdmin(GMAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'campaign', 'playbook', 'level', 'hold', 'rep', 'wanted_level', 'coin', 'stash')
    list_filter = ('campaign', 'playbook', 'hold', 'level')
    search_fields = ('name', 'description')
    filter_horizontal = ('approved_by', 'special_abilities')

# Faction admin is handled in factions/admin.py

@admin.register(Session)
class SessionAdmin(GMAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'campaign', 'status', 'session_date')
    list_filter = ('campaign', 'status', 'session_date')
    search_fields = ('name', 'description', 'objective')
    filter_horizontal = ('npcs_involved', 'characters_involved', 'factions_involved', 'votes')

@admin.register(ProgressClock)
class ProgressClockAdmin(GMAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'clock_type', 'max_segments', 'filled_segments', 'completed', 'campaign', 'crew', 'character', 'faction')
    list_filter = ('clock_type', 'completed', 'campaign', 'crew', 'character', 'faction')
    search_fields = ('name', 'description')

@admin.register(ExperienceTracker)
class ExperienceTrackerAdmin(GMAdminMixin, admin.ModelAdmin):
    list_display = ('character', 'session', 'trigger', 'xp_gained', 'session_date')
    list_filter = ('trigger', 'session', 'session_date')
    search_fields = ('character__true_name', 'description')

@admin.register(DowntimeActivity)
class DowntimeActivityAdmin(GMAdminMixin, admin.ModelAdmin):
    list_display = ('character', 'activity_type', 'stress_relieved', 'harm_healed', 'progress_made', 'created_at')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('character__true_name', 'description', 'result')

@admin.register(Score)
class ScoreAdmin(GMAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'crew', 'score_type', 'target', 'completed', 'rep_gained', 'coin_gained', 'heat_gained')
    list_filter = ('crew', 'score_type', 'completed')
    search_fields = ('name', 'target', 'description')
    filter_horizontal = ('participants',)

# Register remaining models with basic admin
admin.site.register(StandAbility)
admin.site.register(CharacterHamonAbility)
admin.site.register(CharacterSpinAbility)
admin.site.register(ChatMessage)
admin.site.register(XPHistory)
admin.site.register(StressHistory)
admin.site.register(SessionEvent)
# FactionRelationship and CrewFactionRelationship are handled in factions/admin.py
