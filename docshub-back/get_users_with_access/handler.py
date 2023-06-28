import boto3
from boto3.dynamodb.conditions import Key

from utils.dynamodb_config import dynamodb
from utils.response import create_response


def get_users_with_access(event, context):
    item_path = event['queryStringParameters']['fileName']
    print(item_path)

    table_name = 'permissions'
    table = dynamodb.Table(table_name)

    params = {
        'TableName': table_name,
        'IndexName': 'file_name-index',
        'KeyConditionExpression': 'file_name = :item_path',
        'ExpressionAttributeValues': {
            # Assuming file_name is of type 'S' (String)
            ':item_path': item_path
        }
    }

    try:
        response = table.query(**params)

        return create_response(200, response['Items'])

    except Exception as e:
        return create_response(500, e)
