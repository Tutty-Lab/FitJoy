"""Prepare public German listing metadata; never submits a version for review."""
from functools import lru_cache
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
    patch('appStoreVersionLocalizations', german[0]['id'], {
        'description': DESCRIPTION,
        'keywords': 'Gleichgewicht,Balance,Übungen,Bewegung,Alltag,Koordination,Entspannung',
        'promotionalText': 'Kurze Übungseinheiten für deinen Alltag: Entdecke dein 90-Tage-Programm für mehr Gleichgewicht.',
    })
    infos = api('GET', f'/apps/{app_id}/appInfos', token())['data']
    draft_infos = [info for info in infos if info['attributes']['appStoreState'] == 'PREPARE_FOR_SUBMISSION']
    if len(draft_infos) != 1:
        raise RuntimeError('Expected exactly one editable app info')
    info = draft_infos[0]
    info_locs = api('GET', f'/appInfos/{info["id"]}/appInfoLocalizations', token())['data']
    for loc in info_locs:
        if loc['attributes']['locale'] == 'de-DE':
            patch('appInfoLocalizations', loc['id'], {
                'subtitle': 'Dein tägliches Gleichgewicht',
                'privacyPolicyUrl': 'https://fit-joy.vercel.app/privacy',
            })
    patch('appInfos', info['id'], relationships={
        'primaryCategory': {'data': {'type': 'appCategories', 'id': 'HEALTH_AND_FITNESS'}},
    })
    print(f'Prepared German listing and privacy policy for app {app_id}, version {version["id"]}.')


if __name__ == '__main__':
    prepare()
