"""Upload verified German iPhone/iPad captures to the editable FitJoy listing."""
import hashlib
import time
import urllib.parse
import urllib.request
from pathlib import Path
from ios_ci_signing import api, token, BUNDLE

CAPTURES = Path(__file__).resolve().parent.parent / 'store' / 'app-store' / 'de-DE'
SETS = [('APP_IPHONE_67', 'iphone'), ('APP_IPAD_PRO_3GEN_129', 'ipad')]


def upload(screenshot_set, path):
    data = path.read_bytes()
    checksum = hashlib.md5(data).hexdigest()
    current = api('GET', f'/appScreenshotSets/{screenshot_set}/appScreenshots', token())['data']
    matches = [item for item in current if item['attributes']['fileName'] == path.name]
    if matches:
        screenshot = matches[0]
        if screenshot['attributes'].get('sourceFileChecksum') != checksum:
            raise RuntimeError(f'{path.name} already exists with different content; leaving it intact')
    else:
        screenshot = api('POST', '/appScreenshots', token(), {'data': {
            'type': 'appScreenshots',
            'attributes': {'fileName': path.name, 'fileSize': len(data)},
            'relationships': {'appScreenshotSet': {'data': {'type': 'appScreenshotSets', 'id': screenshot_set}}},
        }})['data']
        for operation in screenshot['attributes']['uploadOperations']:
            if urllib.parse.urlparse(operation['url']).scheme != 'https':
                raise RuntimeError('Apple returned an insecure asset upload URL')
            offset = operation['offset']
            chunk = data[offset:offset + operation['length']]
            headers = {header['name']: header['value'] for header in operation['requestHeaders']}
            request = urllib.request.Request(operation['url'], data=chunk, headers=headers, method=operation['method'])
            with urllib.request.urlopen(request, timeout=60) as response:
                if response.status not in [200, 201, 204]:
                    raise RuntimeError(f'Asset upload returned HTTP {response.status}')
        api('PATCH', f'/appScreenshots/{screenshot["id"]}', token(), {'data': {
            'type': 'appScreenshots', 'id': screenshot['id'],
            'attributes': {'sourceFileChecksum': checksum, 'uploaded': True},
        }})
    for attempt in range(30):
        screenshot = api('GET', f'/appScreenshots/{screenshot["id"]}', token())['data']
        delivery = screenshot['attributes']['assetDeliveryState']
        if delivery['state'] == 'COMPLETE':
            print('Screenshot ready:', path.name)
            return
        if delivery['state'] == 'FAILED':
            raise RuntimeError(f'Apple rejected {path.name}: {delivery.get("errors", [])}')
        time.sleep(2)
    raise RuntimeError(f'Apple is still processing {path.name}; check its status before retrying')


def main():
    apps = api('GET', f'/apps?filter[bundleId]={BUNDLE}', token())['data']
    if len(apps) != 1:
        raise RuntimeError('Expected exactly one FitJoy app')
    versions = api('GET', f'/apps/{apps[0]["id"]}/appStoreVersions?filter[platform]=IOS', token())['data']
    drafts = [version for version in versions if version['attributes']['appStoreState'] == 'PREPARE_FOR_SUBMISSION']
    if len(drafts) != 1:
        raise RuntimeError('Expected exactly one editable iOS version')
    locs = api('GET', f'/appStoreVersions/{drafts[0]["id"]}/appStoreVersionLocalizations', token())['data']
    german = [loc for loc in locs if loc['attributes']['locale'] == 'de-DE']
    if len(german) != 1:
        raise RuntimeError('Expected German listing localization')
    localization = german[0]['id']
    sets = api('GET', f'/appStoreVersionLocalizations/{localization}/appScreenshotSets', token())['data']
    for display, prefix in SETS:
        found = [item for item in sets if item['attributes']['screenshotDisplayType'] == display]
        screenshot_set = found[0] if found else api('POST', '/appScreenshotSets', token(), {'data': {
            'type': 'appScreenshotSets', 'attributes': {'screenshotDisplayType': display},
            'relationships': {'appStoreVersionLocalization': {'data': {'type': 'appStoreVersionLocalizations', 'id': localization}}},
        }})['data']
        for screen in ['home', 'calendar', 'day']:
            upload(screenshot_set['id'], CAPTURES / f'{prefix}-{screen}.png')


if __name__ == '__main__':
    main()
