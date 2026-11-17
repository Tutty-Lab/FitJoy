"""Read-only FitJoy release inventory. Credentials stay in the CI environment."""
import json
import os
from ios_ci_signing import api, token, BUNDLE


def inspect():
    auth = token()
    apps = api('GET', f'/apps?filter[bundleId]={BUNDLE}', auth)['data']
    result = {'bundleId': BUNDLE, 'apps': []}
    for app in apps:
        app_id = app['id']
        item = {'id': app_id, 'name': app['attributes']['name'], 'versions': []}
        versions = api('GET', f'/apps/{app_id}/appStoreVersions?filter[platform]=IOS&include=build', auth)
        for version in versions['data']:
            vid = version['id']
            entry = {'id': vid, 'attributes': version['attributes'], 'build': version.get('relationships', {}).get('build', {}).get('data')}
            localizations = api('GET', f'/appStoreVersions/{vid}/appStoreVersionLocalizations', auth)['data']
            entry['localizations'] = []
            for loc in localizations:
                sets = api('GET', f'/appStoreVersionLocalizations/{loc["id"]}/appScreenshotSets?include=appScreenshots', auth)
                entry['localizations'].append({'id': loc['id'], 'attributes': loc['attributes'], 'screenshotSets': sets})
            review = api('GET', f'/appStoreVersions/{vid}/appStoreReviewDetail', auth).get('data')
            entry['reviewDetailPresent'] = bool(review)
            if review:
                attrs = review['attributes']
                entry['reviewFieldsPresent'] = {key: bool(value) for key, value in attrs.items()}
            item['versions'].append(entry)
        item['builds'] = api('GET', f'/builds?filter[app]={app_id}&sort=-uploadedDate&limit=10', auth)['data']
        item['appInfos'] = api('GET', f'/apps/{app_id}/appInfos', auth)['data']
        result['apps'].append(item)
    print(json.dumps(result, indent=2))
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
            output.write(f'app_exists={str(bool(apps)).lower()}\n')


if __name__ == '__main__':
    inspect()
