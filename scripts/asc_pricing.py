"""Configure free download pricing for the organization-funded FitJoy app."""
from decimal import Decimal
from ios_ci_signing import api, token, BUNDLE


def configure():
    auth = token()
    apps = api('GET', f'/apps?filter[bundleId]={BUNDLE}', auth)['data']
    if len(apps) != 1:
        raise RuntimeError('Expected exactly one FitJoy app')
    app_id = apps[0]['id']
    try:
        schedule = api('GET', f'/apps/{app_id}/appPriceSchedule', auth).get('data')
    except RuntimeError as error:
        if 'failed (404)' not in str(error):
            raise
        schedule = None
    if schedule:
        manual = api('GET', f'/appPriceSchedules/{schedule["id"]}/manualPrices?include=appPricePoint&limit=200', auth)
        if manual['data']:
            print('App download pricing already has assigned price points; leaving it unchanged.')
            return
    points = api('GET', f'/apps/{app_id}/appPricePoints?filter[territory]=DEU&limit=200', auth)
    while True:
        free = [point for point in points['data'] if Decimal(point['attributes']['customerPrice']) == 0]
        if free:
            break
        next_url = points.get('links', {}).get('next')
        if not next_url:
            raise RuntimeError('No free German app price point returned by Apple')
        if not next_url.startswith('https://api.appstoreconnect.apple.com/v1/'):
            raise RuntimeError('Unexpected price pagination host')
        points = api('GET', next_url.split('/v1', 1)[1], auth)
    price_id = '${fitjoy-free-download}'
    body = {'data': {
        'type': 'appPriceSchedules',
        'relationships': {
            'app': {'data': {'type': 'apps', 'id': app_id}},
            'baseTerritory': {'data': {'type': 'territories', 'id': 'DEU'}},
            'manualPrices': {'data': [{'type': 'appPrices', 'id': price_id}]},
        },
    }, 'included': [{
        'type': 'appPrices', 'id': price_id,
        'attributes': {'startDate': None, 'endDate': None},
        'relationships': {'appPricePoint': {'data': {'type': 'appPricePoints', 'id': free[0]['id']}}},
    }]}
    result = api('POST', '/appPriceSchedules', auth, body)['data']
    print('Configured free download pricing:', result['id'])


if __name__ == '__main__':
    configure()
