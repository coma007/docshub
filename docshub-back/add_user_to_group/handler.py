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

    # print(user_pool_id, user_name)
    client = boto3.client('cognito-idp')

    try:
        response = client.admin_add_user_to_group(
            UserPoolId=user_pool_id,
            Username=user_name,
            GroupName=group_name
        )

        directory_name = f'public/{user_sub}/'
        s3.put_object(Body='', Bucket=s3_bucket_name, Key=directory_name)

        ses_client = boto3.client('ses')
        email_address = event["request"]["userAttributes"]["email"]
        print(email_address)
        ses_client.verify_email_identity(EmailAddress=email_address)

        # add topic for notifications

        sns_client = boto3.client('sns')
        response_topic = sns_client.create_topic(
            Name=user_sub,
            # DataProtectionPolicy='string'
        )
        print(response_topic)
        response = sns_client.subscribe(
            TopicArn=response_topic["TopicArn"],
            Protocol='lambda',
            Endpoint='arn:aws:lambda:eu-central-1:852459778358:function:docshub-back-dev-on_file_change',
            # Attributes={
            #     'string': 'string'
            # },
            ReturnSubscriptionArn=True
        )
        print(response)

        return event
    except Exception as e:
        print(e)
        return event
