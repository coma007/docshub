import boto3
import json
from botocore.exceptions import ClientError

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, table_name

from utils.response import create_response


def get_file_s3(event, context):
    try:
        body = event['body']
        file_id = body['fileId']

        file_name = body['fileName']
        album_id = body['albumId']

        old_item = table.get_item(
            TableName=table_name,
            Key={
                'album_id': album_id,
                'file_id': file_id
            }
        )

        return create_response(200, old_item)
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return create_response(500, "Item does not exist")
        else:
            return create_response(500, e)
    except Exception as e:
        return create_response(500, e)
