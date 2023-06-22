import json


def create_response(status, body):
    return {
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'statusCode': status,
        'body': json.dumps(body, default=str)
    }
