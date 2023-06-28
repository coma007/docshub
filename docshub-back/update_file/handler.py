import boto3
import json
from botocore.exceptions import ClientError

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, table_name

from utils.response import create_response


def update_file(event, context):

    try:
        body = event['body']
        file_id = body['fileId']

        file_name = body['fileName']
        album_id = body['albumId']
        description = body['description']
        tags = body['tags']

        table.update_item(
        Key={"file_id": file_id, "album_id": album_id},
        UpdateExpression="set "
                         "#description = :description_val, "
                         "#tags = :tags_val ",
        ExpressionAttributeNames={
            "#file_name": "file_name",
            "#album_id": "name",
            "#description": "description",
            "#tags": "tags",
        },
        ConditionExpression="file_id = :file_id_val AND album_id = :album_id_val ",
        ExpressionAttributeValues={
            ":file_name_val": file_name,
            ":file_id_val": file_id,
            ":album_id_val": album_id,
            ":description_val": description,
            ":tags_val": tags,
        },
        ReturnValues="UPDATED_NEW",
        )

        return create_response(200, body)
    except ClientError as e:
        if e.response['Error']['Code']=='ConditionalCheckFailedException':
            return create_response(500, "Item does not exist")
        else:
           return create_response(500, e)
    except Exception as e:
        return create_response(500, e)
