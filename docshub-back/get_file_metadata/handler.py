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
                return create_response(200, item)
        return create_response(404, None)
    except Exception as e:
        return create_response(500, e)
