import boto3
from boto3.dynamodb.conditions import Key

from utils.dynamodb_config import dynamodb
from utils.response import create_response


def get_user_access(event, context):
    username = event['queryStringParameters']['username']

    table_name = 'permissions'
    table = dynamodb.Table(table_name)

    try:
        query_params = {
            'TableName': table_name,
            'KeyConditionExpression': 'username = :username',
            'ExpressionAttributeValues': {
                ':username': username
            }
        }
        response = table.query(**query_params)
        items = response['Items']
        return create_response(200, items)
    except Exception as e:
        return create_response(500, e)
