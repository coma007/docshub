import os
import urllib

import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table
import base64

from utils.response import create_response

table = "meta"
s3_client = boto3.client('s3')
dynamo_client = boto3.client('dynamodb')


def upload_file_s3(event, context):
    print(event)
    file_base64 = event["body"]['file']
    file_name = event["body"]["fileName"]
    obj = s3.put_object(Bucket=s3_bucket_name,Body=base64.b64decode(file_base64),Key="public/"+file_name)

    return create_response(200, event["body"])


