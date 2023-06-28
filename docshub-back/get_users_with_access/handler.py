import boto3
from boto3.dynamodb.conditions import Key

from utils.dynamodb_config import dynamodb
from utils.response import create_response


def get_users_with_access(event, context):
    item_path = event['queryStringParameters']['fileName']

    table_name = 'permissions'
    table = dynamodb.Table(table_name)

    try:
        response = table.query(
            IndexName="item_path-index",
            KeyConditionExpression=Key('item_path').eq(item_path),
        )
        print(response)

        usernames = [item['username'] for item in response['Items']]

        return {
            'statusCode': 200,
            'body': usernames
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }
