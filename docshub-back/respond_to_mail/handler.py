import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, table_name

client = boto3.client('cognito-idp')
from utils.response import create_response


def handle(event, context):
    try:
        if event["access"] == True:
            return create_response(200, True)
        else:
            return create_response(200, True)

    except Exception as e:
        print(e)
        return create_response(500, e)