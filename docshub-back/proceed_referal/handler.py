import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, table_name

from utils.response import create_response


def proceed_referal(event, context):
    print(event)
    body = json.loads(event["Records"][0]["body"])
    new_user = body["input"]["user"]
    referal = body["input"]["referal"]
    token = body["FamilyTaskToken"]
    
    print(token)

    client = boto3.client('ses', region_name="eu-central-1")
      
    accept_url = f"https://95dxj4ei9c.execute-api.eu-central-1.amazonaws.com/test/api/referal-callback?callback_token={token};new_user={new_user};referal={referal};accepted=true"
    decline_url = f"https://95dxj4ei9c.execute-api.eu-central-1.amazonaws.com/test/api/referal-callback?callback_token={token};new_user={new_user};referal={referal};accepted=false"
    
    email_body = """ 
        <p>User {0} requested family member access that grants exclusive access to all your files.</p>
        <p>
            Select one of the options bellow: <br>
            <a href="{1}">Confirm request</a> <br>
            <a href="{2}">Decline request</a>
        </p>
    """.format(new_user, accept_url, decline_url)
  
    try:
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    referal,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': "UTF-8",
                        'Data': email_body,
                    },
                    'Text': {
                        'Charset':  "UTF-8",
                        'Data': "Zdravo",
                    },
                },
                'Subject': {
                    'Charset': "UTF-8",
                    'Data': "Confirm access to family member",
                },
            },
            Source="docshub.noreply@gmail.com",
        )
    except Exception as e:
        stepfunctions_client = boto3.client('stepfunctions')
        stepfunctions_client.send_task_failure(
            taskToken=execution_id,
            output=json.dumps({'error': e})
        )
