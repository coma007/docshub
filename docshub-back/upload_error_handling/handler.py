import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table

from utils.response import create_response


def handle_error(event, context):

    try:
        body = json.loads(event['body'])
        return create_response(500, body)

    except Exception as e:

        return create_response(500, e)
