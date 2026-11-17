"""Prepare public German listing metadata; never submits a version for review."""
from functools import lru_cache
import json
import os
from ios_ci_signing import api, token as signing_token, BUNDLE

token = lru_cache(maxsize=1)(signing_token)

DESCRIPTION = '''Der Gleichgewichts-Code begleitet dich durch ein 90-Tage-Programm mit kurzen Gleichgewichtsübungen für deinen Alltag.

• Drei Übungseinheiten pro Tag: morgens, mittags und abends
• Videoanleitung und ein Timer für deine Übungsminute
• Eine zusätzliche Bonus-Minute nach der Grundübung
• Ein Kalender mit deinem täglichen Fortschritt
• Selbsttests und ein Vergleich deiner Ergebnisse
• Persönliche Erinnerungszeiten

Für die Nutzung benötigst du ein Konto und eine Freischaltung durch deinen teilnehmenden Anbieter oder deine Organisation. In der App werden keine Abonnements oder digitalen Inhalte verkauft.

Die App bietet allgemeine Übungen und ersetzt keine ärztliche Beratung. Sprich bei Beschwerden oder Unsicherheit vor dem Training mit deiner Ärztin oder deinem Arzt.'''


def patch(kind, resource_id, attributes=None, relationships=None):
    data = {'type': kind, 'id': resource_id}
    if attributes:
        data['attributes'] = attributes
    if relationships:
        data['relationships'] = relationships
    return api('PATCH', f'/{kind}/{resource_id}', token(), {'data': data})


def prepare():
    apps = api('GET', f'/apps?filter[bundleId]={BUNDLE}', token())['data']
    if len(apps) != 1:
        raise RuntimeError('Expected exactly one FitJoy app record')
    app_id = apps[0]['id']
    versions = api('GET', f'/apps/{app_id}/appStoreVersions?filter[platform]=IOS', token())['data']
    drafts = [v for v in versions if v['attributes']['appStoreState'] == 'PREPARE_FOR_SUBMISSION']
    if len(drafts) != 1:
        raise RuntimeError('Expected exactly one editable iOS draft')
    version = drafts[0]
    locs = api('GET', f'/appStoreVersions/{version["id"]}/appStoreVersionLocalizations', token())['data']
    german = [loc for loc in locs if loc['attributes']['locale'] == 'de-DE']
    if len(german) != 1:
        raise RuntimeError('German localization must exist')
    infos = api('GET', f'/apps/{app_id}/appInfos', token())['data']
    draft_infos = [info for info in infos if info['attributes']['appStoreState'] == 'PREPARE_FOR_SUBMISSION']
    if len(draft_infos) != 1:
        raise RuntimeError('Expected exactly one editable app info')
    info = draft_infos[0]
    info_locs = api('GET', f'/appInfos/{info["id"]}/appInfoLocalizations', token())['data']
    age = api('GET', f'/appInfos/{info["id"]}/ageRatingDeclaration', token())['data']
    review = api('GET', f'/appStoreVersions/{version["id"]}/appStoreReviewDetail', token()).get('data')
    builds = api('GET', f'/builds?filter[app]={app_id}&filter[version]=141&limit=10', token())['data']
    patch('appStoreVersionLocalizations', german[0]['id'], {
        'description': DESCRIPTION,
        'keywords': 'Gleichgewicht,Balance,Übungen,Bewegung,Alltag,Koordination,Entspannung',
        'promotionalText': 'Kurze Übungseinheiten für deinen Alltag: Entdecke dein 90-Tage-Programm für mehr Gleichgewicht.',
        'supportUrl': 'https://fit-joy.vercel.app/support.html',
    })
    for loc in info_locs:
        if loc['attributes']['locale'] == 'de-DE':
            patch('appInfoLocalizations', loc['id'], {
                'subtitle': 'Dein tägliches Gleichgewicht',
                'privacyPolicyUrl': 'https://fit-joy.vercel.app/privacy',
            })
    patch('appInfos', info['id'], relationships={
        'primaryCategory': {'data': {'type': 'appCategories', 'id': 'HEALTH_AND_FITNESS'}},
    })
    age_attributes = {
        key: ('NONE' if isinstance(value, str) else False)
        for key, value in age['attributes'].items()
        if key in {
            'advertising', 'alcoholTobaccoOrDrugUseOrReferences', 'contests', 'gambling',
            'gamblingSimulated', 'gunsOrOtherWeapons', 'lootBox', 'medicalOrTreatmentInformation',
            'messagingAndChat', 'parentalControls', 'profanityOrCrudeHumor', 'ageAssurance',
            'sexualContentGraphicAndNudity', 'sexualContentOrNudity', 'socialMedia',
            'socialMediaAgeRestricted', 'horrorOrFearThemes', 'matureOrSuggestiveThemes',
            'unrestrictedWebAccess', 'userGeneratedContent', 'violenceCartoonOrFantasy',
            'violenceRealisticProlongedGraphicOrSadistic', 'violenceRealistic',
        }
    }
    # Null declaration values still have fixed types in Apple's schema.
    for key in ['alcoholTobaccoOrDrugUseOrReferences', 'contests', 'gamblingSimulated',
                'gunsOrOtherWeapons', 'medicalOrTreatmentInformation', 'profanityOrCrudeHumor',
                'sexualContentGraphicAndNudity', 'sexualContentOrNudity', 'horrorOrFearThemes',
                'matureOrSuggestiveThemes', 'violenceCartoonOrFantasy',
                'violenceRealisticProlongedGraphicOrSadistic', 'violenceRealistic']:
        age_attributes[key] = 'NONE'
    age_attributes['healthOrWellnessTopics'] = True
    patch('ageRatingDeclarations', age['id'], age_attributes)
    valid = [build for build in builds if build['attributes']['processingState'] == 'VALID']
    if len(valid) == 1:
        patch('appStoreVersions', version['id'], relationships={'build': {'data': {'type': 'builds', 'id': valid[0]['id']}}})
        print('Selected processed build 141.')
    contact = json.loads(os.environ.get('FITJOY_REVIEW_CONTACT', '{}'))
    if contact:
        attributes = {**contact,
            'demoAccountRequired': True,
            'notes': 'Organization-funded balance exercise program. Sign in with the review account to access the full program; no invitation code or purchase is needed for this account. Start the daily basic exercise, then optionally a bonus minute. Account deletion is available under Profile. No in-app purchases, advertisements, or third-party tracking SDKs are used. The app provides general exercise guidance and does not diagnose medical conditions.',
        }
        if review:
            patch('appStoreReviewDetails', review['id'], attributes)
        else:
            api('POST', '/appStoreReviewDetails', token(), {'data': {
                'type': 'appStoreReviewDetails', 'attributes': attributes,
                'relationships': {'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': version['id']}}},
            }})
        print('Saved private App Review contact and demo access.')
    print(f'Prepared German listing and privacy policy for app {app_id}, version {version["id"]}.')


if __name__ == '__main__':
    prepare()
