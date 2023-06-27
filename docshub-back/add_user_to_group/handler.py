import boto3
import json
from utils.response import create_response
from utils.s3_config import s3, s3_bucket_name


def add_user_to_group(event, context):
    print(event)
    user_pool_id = event["userPoolId"]
    user_name = event["userName"]
    group_name = 'FileOwners'
    user_sub = event['request']['userAttributes']['sub']

    print(user_pool_id, user_name)
    client = boto3.client('cognito-idp')

    try:
        response = client.admin_add_user_to_group(
            UserPoolId=user_pool_id,
            Username=user_name,
            GroupName=group_name
        )

        directory_name = f'public/{user_sub}/'
        s3.put_object(Body='', Bucket=s3_bucket_name, Key=directory_name)

        return event
    except Exception as e:
        print(e)
        return event
