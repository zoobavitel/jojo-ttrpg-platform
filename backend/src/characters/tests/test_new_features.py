"""
Tests for the 8 new feature implementations:
1. Action dots capped at 7 total, max 2 per action (at level 1)
2. Stand Coin Stats capped at A(4) for players
3. Minimum 1 stat must be D or higher (no all-F)
4. Armor charges auto-derived from Durability grade
5. Development grade session XP bonus
6. Level-up binary (validated via XP advancements)
7. 5 XP → +1 action dot outside level-up (via spend_xp_for_action_dice)
8. Resistance critical clears 1 stress (frontend only — no backend test needed)
"""
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from characters.models import Character, Heritage, Ability, Stand


def _make_valid_character(user, heritage, a1, a2, a3):
    """Helper: create a saved level-1 character with 7 action dots and a C/C/C/C/C/F Stand."""
    character = Character(
        user=user,
        true_name='Test Character',
        heritage=heritage,
        action_dots={
            'hunt': 1, 'study': 1, 'survey': 1, 'tinker': 1,
            'finesse': 1, 'prowl': 1, 'skirmish': 1, 'wreck': 0,
            'attune': 0, 'command': 0, 'consort': 0, 'sway': 0,
        },
        stress=9,
        coin_stats={},
        trauma=[],
        xp_clocks={},
    )
    character.save()
    character.standard_abilities.add(a1, a2, a3)
    stand = Stand(
        character=character,
        name='Test Stand',
        type='FIGHTING',
        form='Humanoid',
        consciousness_level='C',
        power='C', speed='C', range='C', durability='C', precision='C', development='F',
    )
    stand.save()
    return character


class ActionDotsCapTests(TestCase):
    """Feature 1: Action dots capped at 7 total, max 2 per action (level 1)."""

    def setUp(self):
        self.user = User.objects.create_user(username='u1', password='pw')
        self.heritage = Heritage.objects.create(name='H1', base_hp=0)
        self.a1 = Ability.objects.create(name='Ab1', type='standard', description='')
        self.a2 = Ability.objects.create(name='Ab2', type='standard', description='')
        self.a3 = Ability.objects.create(name='Ab3', type='standard', description='')

    def test_valid_7_dots_passes(self):
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        # Should NOT raise about action_dots
        try:
            char.full_clean()
        except ValidationError as e:
            self.assertNotIn('action_dots', e.message_dict)

    def test_total_exceeds_7_fails(self):
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        dots = dict(char.action_dots)
        dots['hunt'] = 2   # was 1 → total becomes 8
        char.action_dots = dots
        with self.assertRaises(ValidationError) as ctx:
            char.full_clean()
        self.assertIn('action_dots', ctx.exception.message_dict)

    def test_single_action_exceeds_2_fails(self):
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        # Keep total at 7 but put 3 in one action
        dots = {
            'hunt': 3, 'study': 1, 'survey': 1, 'tinker': 1,
            'finesse': 1, 'prowl': 0, 'skirmish': 0, 'wreck': 0,
            'attune': 0, 'command': 0, 'consort': 0, 'sway': 0,
        }
        char.action_dots = dots
        with self.assertRaises(ValidationError) as ctx:
            char.full_clean()
        self.assertIn('action_dots', ctx.exception.message_dict)
        msgs = ' '.join(ctx.exception.message_dict['action_dots'])
        self.assertIn('cannot have more than 2 dots at level 1', msgs)


class StandStatCapTests(TestCase):
    """Feature 2: Stand Coin Stats capped at A(4) for players.
       Feature 3: Minimum 1 stat must be D or higher (no all-F).
    """

    def setUp(self):
        self.user = User.objects.create_user(username='u2', password='pw')
        self.heritage = Heritage.objects.create(name='H2', base_hp=0)
        self.a1 = Ability.objects.create(name='Ab4', type='standard', description='')
        self.a2 = Ability.objects.create(name='Ab5', type='standard', description='')
        self.a3 = Ability.objects.create(name='Ab6', type='standard', description='')

    def test_s_rank_rejected_by_default(self):
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        char.stand.power = 'S'
        char.stand.save()
        with self.assertRaises(ValidationError) as ctx:
            char.full_clean()
        msgs = ' '.join(ctx.exception.message_dict.get('stand_coin_stats', []))
        self.assertIn('S-rank', msgs)

    def test_s_rank_allowed_with_gm_permission(self):
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        char.gm_can_have_s_rank_stand_stats = True
        char.stand.power = 'S'
        char.stand.save()
        # Should not raise a stand_coin_stats error for S-rank
        try:
            char.full_clean()
        except ValidationError as e:
            self.assertNotIn('S-rank', ' '.join(e.message_dict.get('stand_coin_stats', [])))

    def test_a_rank_allowed_for_players(self):
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        char.stand.power = 'A'
        char.stand.save()
        try:
            char.full_clean()
        except ValidationError as e:
            self.assertNotIn('S-rank', ' '.join(e.message_dict.get('stand_coin_stats', [])))

    def test_invalid_grade_rejected(self):
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        char.stand.power = 'Z'
        char.stand.save()
        with self.assertRaises(ValidationError) as ctx:
            char.full_clean()
        msgs = ' '.join(ctx.exception.message_dict.get('stand_coin_stats', []))
        self.assertIn('Invalid grade', msgs)

    def test_all_f_rejected(self):
        """Feature 3: all-F stand stats should be rejected."""
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        for field in ['power', 'speed', 'range', 'durability', 'precision', 'development']:
            setattr(char.stand, field, 'F')
        char.stand.save()
        with self.assertRaises(ValidationError) as ctx:
            char.full_clean()
        msgs = ' '.join(ctx.exception.message_dict.get('stand_coin_stats', []))
        self.assertIn('all-F', msgs)

    def test_one_d_stat_passes_min_requirement(self):
        """Feature 3: one D stat among F stats is valid."""
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        for field in ['power', 'speed', 'range', 'durability', 'precision']:
            setattr(char.stand, field, 'F')
        char.stand.development = 'D'
        char.stand.save()
        try:
            char.full_clean()
        except ValidationError as e:
            # Should not raise about all-F
            self.assertNotIn('all-F', ' '.join(e.message_dict.get('stand_coin_stats', [])))


class ArmorChargesTests(TestCase):
    """Feature 4: Armor charges auto-derived from Durability grade."""

    def setUp(self):
        self.user = User.objects.create_user(username='u3', password='pw')
        self.heritage = Heritage.objects.create(name='H3', base_hp=0)
        self.a1 = Ability.objects.create(name='Ab7', type='standard', description='')
        self.a2 = Ability.objects.create(name='Ab8', type='standard', description='')
        self.a3 = Ability.objects.create(name='Ab9', type='standard', description='')

    def _char_with_durability(self, durability):
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        char.stand.durability = durability
        char.stand.save()
        return char

    def test_f_durability_gives_1_charge(self):
        char = self._char_with_durability('F')
        self.assertEqual(char.stand.armor_charges, 1)

    def test_d_durability_gives_2_charges(self):
        char = self._char_with_durability('D')
        self.assertEqual(char.stand.armor_charges, 2)

    def test_c_durability_gives_3_charges(self):
        char = self._char_with_durability('C')
        self.assertEqual(char.stand.armor_charges, 3)

    def test_b_durability_gives_4_charges(self):
        char = self._char_with_durability('B')
        self.assertEqual(char.stand.armor_charges, 4)

    def test_a_durability_gives_4_charges(self):
        char = self._char_with_durability('A')
        self.assertEqual(char.stand.armor_charges, 4)


class DevelopmentXPBonusTests(TestCase):
    """Feature 5: Development grade session XP bonus."""

    def setUp(self):
        self.user = User.objects.create_user(username='u4', password='pw')
        self.heritage = Heritage.objects.create(name='H4', base_hp=0)
        self.a1 = Ability.objects.create(name='Ab10', type='standard', description='')
        self.a2 = Ability.objects.create(name='Ab11', type='standard', description='')
        self.a3 = Ability.objects.create(name='Ab12', type='standard', description='')

    def _char_with_development(self, development):
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        char.stand.development = development
        char.stand.save()
        return char

    def test_f_development_gives_0_bonus(self):
        char = self._char_with_development('F')
        self.assertEqual(char.development_xp_bonus, 0)

    def test_d_development_gives_1_bonus(self):
        char = self._char_with_development('D')
        self.assertEqual(char.development_xp_bonus, 1)

    def test_c_development_gives_2_bonus(self):
        char = self._char_with_development('C')
        self.assertEqual(char.development_xp_bonus, 2)

    def test_b_development_gives_3_bonus(self):
        char = self._char_with_development('B')
        self.assertEqual(char.development_xp_bonus, 3)

    def test_a_development_gives_4_bonus(self):
        char = self._char_with_development('A')
        self.assertEqual(char.development_xp_bonus, 4)


class XPAdvancementTests(TestCase):
    """Feature 7: 5 XP → +1 action dot (spend_xp_for_action_dice)
       Also validates that the XP advancement tracking works correctly.
    """

    def setUp(self):
        self.user = User.objects.create_user(username='u5', password='pw')
        self.heritage = Heritage.objects.create(name='H5', base_hp=0)
        self.a1 = Ability.objects.create(name='Ab13', type='standard', description='')
        self.a2 = Ability.objects.create(name='Ab14', type='standard', description='')
        self.a3 = Ability.objects.create(name='Ab15', type='standard', description='')

    def test_spend_5_xp_for_action_dot(self):
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        char.xp_clocks = {'insight': 5}
        char.save()

        char.spend_xp_for_action_dice('insight', 1)
        char.refresh_from_db()

        self.assertEqual(char.xp_clocks['insight'], 0)
        self.assertEqual(char.total_xp_spent, 5)
        self.assertEqual(char.action_dice_gained, 1)

    def test_insufficient_xp_raises(self):
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        char.xp_clocks = {'insight': 3}
        char.save()

        with self.assertRaises(ValidationError):
            char.spend_xp_for_action_dice('insight', 1)

    def test_xp_advancement_tracking_consistent(self):
        char = _make_valid_character(self.user, self.heritage, self.a1, self.a2, self.a3)
        char.xp_clocks = {'insight': 10}
        char.save()

        # Spend 5 XP for 1 action dot
        char.spend_xp_for_action_dice('insight', 1)
        char.refresh_from_db()

        # full_clean should not raise about XP mismatch
        try:
            char.full_clean()
        except ValidationError as e:
            self.assertNotIn('total_xp_spent', e.message_dict)
