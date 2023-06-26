import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, table_name

from utils.response import create_response


def get_file_metadata(event, context):
    fileKey = event['pathParameters']['key']
    try:
        response = table.get_item(
            TableName=table_name,
            Key={
                'album_id': 'ALBUM',
                'file_id': fileKey
            }
        )
        return create_response(200, response['Item'])

    except Exception as e:
        return create_response(500, e)
