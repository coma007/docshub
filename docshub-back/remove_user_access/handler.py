import boto3
from boto3.dynamodb.conditions import Key

from utils.dynamodb_config import dynamodb
from utils.response import create_response


def remove_user_access(event, context):
    permission = event['permission']

    username = permission['username']
    file_name = permission['file_name']

    table_name = 'permissions'
    table = dynamodb.Table(table_name)

    try:
        table.delete_item(
            Key={
                'username': username,
                'file_name': file_name
            }
        )

        if file_name.endswith("/"):
            response = table.query(
                KeyConditionExpression='username = :username AND begins_with(file_name, :prefix)',
                ExpressionAttributeValues={
                    ':username': username,
                    ':prefix': file_name
                }
            )

            with table.batch_writer() as batch:
                for item in response['Items']:
                    batch.delete_item(
                        Key={
                            'username': item['username'],
                            'file_name': item['file_name']
                        }
                    )

        return create_response(200, "Deleted successfuly")
    except Exception as e:
        return create_response(500, e)
