import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import album_table

from utils.response import create_response


def create_album(event, context):
    try:
        body = json.loads(event['body'])['data']
        parent_album_id = body['parentAlbumId']
        album_id = body['albumId']
        album_name = body['albumName']
    
        s3.put_object(Bucket=s3_bucket_name, Key=("public/" + parent_album_id + "/" + album_id + "/"))
    
        album_table.put_item(Item={
            'album_id': album_id,
            'parent_album_id': parent_album_id,
            'album_name': album_name
        })

        return create_response(200, body)

    except Exception as e:

        raise Exception(e)
