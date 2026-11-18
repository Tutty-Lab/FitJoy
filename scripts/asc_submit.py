"""Submit the selected FitJoy iOS draft; Apple validates listing completeness first."""
from ios_ci_signing import api, token, BUNDLE
import argparse


def submit(prepare_only=False):
    auth = token()
    apps = api('GET', f'/apps?filter[bundleId]={BUNDLE}', auth)['data']
    if len(apps) != 1:
        raise RuntimeError('Expected exactly one FitJoy app')
    app_id = apps[0]['id']
    versions = api('GET', f'/apps/{app_id}/appStoreVersions?filter[platform]=IOS&include=build', auth)
    drafts = [v for v in versions['data'] if v['attributes']['appStoreState'] == 'PREPARE_FOR_SUBMISSION']
    if len(drafts) != 1:
        raise RuntimeError('Expected exactly one editable iOS draft')
    version = drafts[0]
    # Copyright and rights to the supplied materials were confirmed by the owner.
    api('PATCH', f'/apps/{app_id}', auth, {'data': {
        'type': 'apps', 'id': app_id,
        'attributes': {'contentRightsDeclaration': 'USES_THIRD_PARTY_CONTENT'},
    }})
    api('PATCH', f'/appStoreVersions/{version["id"]}', auth, {'data': {
        'type': 'appStoreVersions', 'id': version['id'],
        'attributes': {'copyright': '2026 Tutty Lab'},
    }})
    if prepare_only:
        print('Saved owner-confirmed copyright and content rights.')
        return
    if not version.get('relationships', {}).get('build', {}).get('data'):
        raise RuntimeError('No build selected for review')
    submissions = api('GET', f'/apps/{app_id}/reviewSubmissions?filter[platform]=IOS', auth)['data']
    active = [s for s in submissions if s['attributes']['state'] in ['WAITING_FOR_REVIEW', 'IN_REVIEW']]
    if active:
        print('Already submitted:', active[0]['id'], active[0]['attributes']['state'])
        return
    ready = [s for s in submissions if s['attributes']['state'] == 'READY_FOR_REVIEW']
    if len(ready) > 1:
        raise RuntimeError('Multiple review drafts; select the intended submission manually')
    review = ready[0] if ready else api('POST', '/reviewSubmissions', auth, {'data': {
        'type': 'reviewSubmissions', 'attributes': {'platform': 'IOS'},
        'relationships': {'app': {'data': {'type': 'apps', 'id': app_id}}},
    }})['data']
    review_id = review['id']
    items = api('GET', f'/reviewSubmissions/{review_id}/items?include=appStoreVersion', auth)['data']
    linked = [item for item in items if (item.get('relationships', {}).get('appStoreVersion', {}).get('data') or {}).get('id') == version['id']]
    if items and not linked:
        raise RuntimeError('Review draft contains another version; refusing to change its items')
    if not linked:
        api('POST', '/reviewSubmissionItems', auth, {'data': {
            'type': 'reviewSubmissionItems', 'relationships': {
                'reviewSubmission': {'data': {'type': 'reviewSubmissions', 'id': review_id}},
                'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': version['id']}},
            },
        }})
    api('PATCH', f'/reviewSubmissions/{review_id}', auth, {'data': {
        'type': 'reviewSubmissions', 'id': review_id, 'attributes': {'submitted': True},
    }})
    result = api('GET', f'/reviewSubmissions/{review_id}', auth)['data']
    print('Review submission:', review_id, result['attributes']['state'])


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--prepare-only', action='store_true')
    submit(parser.parse_args().prepare_only)
