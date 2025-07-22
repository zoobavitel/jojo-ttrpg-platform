from django.contrib import admin
from .models import Faction, FactionRelationship, CrewFactionRelationship

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

@admin.register(Faction)
class FactionAdmin(GMAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'campaign', 'faction_type', 'level', 'hold', 'reputation')
    list_filter = ('faction_type', 'campaign')
    search_fields = ('name', 'notes')
    list_editable = ('level', 'hold', 'reputation')

@admin.register(FactionRelationship)
class FactionRelationshipAdmin(GMAdminMixin, admin.ModelAdmin):
    list_display = ('source_faction', 'target_faction', 'reputation_value')
    list_filter = ('source_faction', 'target_faction')
    list_editable = ('reputation_value',)

@admin.register(CrewFactionRelationship)
class CrewFactionRelationshipAdmin(GMAdminMixin, admin.ModelAdmin):
    list_display = ('crew', 'faction', 'reputation_value')
    list_filter = ('crew', 'faction')
    list_editable = ('reputation_value',)
