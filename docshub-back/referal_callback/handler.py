import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, table_name

from utils.response import create_response


def referal_callback(event, context):
    callback_token = event['queryStringParameters']['callback_token'].replace(" ", "+")
    new_user = event['queryStringParameters']['new_user']
    referal_email = event['queryStringParameters']['referal']
    accepted = event['queryStringParameters']['accepted']
    
    if accepted == "true":
        accepted = 0
    else:
        accepted = 1
    
    try:
        
        cognito_client = boto3.client('cognito-idp')
    
        # Search for the user using the email address
        response = cognito_client.list_users(
            UserPoolId='eu-central-1_PQInK2hdy',
            Filter='email = "{}"'.format(referal_email)
        )
        
        if 'Users' in response and len(response['Users']) > 0:
            sub = response['Users'][0]["Attributes"][0]["Value"]
            
            stepfunctions_client = boto3.client('stepfunctions', region_name='eu-central-1')
            stepfunctions_client.send_task_success(
                taskToken=callback_token,
                output=json.dumps({
                    'accepted': accepted, 
                    'users': [new_user],
                    'fileKey': sub + "/"
                })
            )
            if accepted == 0:
                return create_response(200, "Granted exclusive access to " + new_user)
            else:
                return create_response(200, "Denied exclusive access to " + new_user)
        return create_response(404, "Referal not found")
    except Exception as e:
        return create_response(500, e)
