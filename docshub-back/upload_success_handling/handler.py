import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table

from utils.response import create_response


def handle_success(event, context):

    try:
        return create_response(200, "Success")

    except Exception as e:

        raise Exception(e)
