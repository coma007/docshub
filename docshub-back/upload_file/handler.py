import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table
import uuid
from utils.response import create_response


id_db=uuid.uuid4()

def upload_file(event, context):

    try:
        body = event['body']
        file_id = body['fileName']
        file_name = body['fileName']
        album_id = body['albumId']
        file_size = body['fileSize']
        file_type = body['fileType']
        description = body['description']
        creation_date = body['dateOfCreation']
        tags = body['tags']

        table.put_item(Item={
            'album_id': album_id,
            'file_id': file_id,
            'file_size': file_size,
            'file_type': file_type,
            'file_name': file_name,
            'description': description,
            'creation_date': creation_date,
            'last_change_date': creation_date,
            'tags': tags
        })

        return create_response(200, body)

    except Exception as e:

        raise Exception(e)
