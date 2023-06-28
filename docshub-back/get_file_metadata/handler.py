import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, table_name

from utils.response import create_response


def get_file_metadata(event, context):
    attribute_name = "file_name"
    fullName = event['queryStringParameters']['fileName']
    fileTokens = fullName.split("/")
    fileKey = fileTokens[-1]
    albumId = ""
    for key in fileTokens:
        if key == fileKey:
            break
        albumId += key + "/"
    albumId = albumId[:-1]
    try:
        response = table.query(
            KeyConditionExpression="album_id = :id",
            ExpressionAttributeValues={
                ":id": albumId,
            },
        )
        
        for item in response["Items"]:
            if item['file_name'] == fileKey:
                item['owner'] = find_owner(item['album_id'])
                return create_response(200, item)
        return create_response(404, None)
    except Exception as e:
        return create_response(500, e)


def find_owner(album_id):
    owner_sub = album_id.split("/")[0]

    client = boto3.client('cognito-idp', region_name='eu-central-1')
    try:
        response = client.list_users(
            UserPoolId='eu-central-1_PQInK2hdy',
            Filter=f'sub = "{owner_sub}"'
        )
        username = response['Users'][0]['Username']
        return username
    except IndexError:
        return None
    except Exception as e:
        print(f'Error: {str(e)}')
        return None