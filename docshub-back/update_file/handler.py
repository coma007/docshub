import boto3
import json
from botocore.exceptions import ClientError
from datetime import datetime

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
                         "#last_change_date = :last_change_date, "
                         "#tags = :tags_val ",
        ConditionExpression="#file_id = :file_id_val AND #album_id = :album_id_val ",
        ExpressionAttributeNames={
            "#file_id": "file_id",
            "#album_id": "album_id",
            "#description": "description",
            "#last_change_date" : "last_change_date",
            "#tags": "tags",
        },

        ExpressionAttributeValues={
            ":file_id_val": file_id,
            ":album_id_val": album_id,
            ":description_val": description,
            ":last_change_date" : datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
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
