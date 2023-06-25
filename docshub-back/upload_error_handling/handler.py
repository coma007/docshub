import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table

from utils.response import create_response


def handle_error(event, context):
    try:
        file_name = event["body"]["fileName"]
        album_id = event["body"]["albumId"]
        delete_if_exists("public/" + file_name, file_name, album_id)
        error = event['error']
        return create_response(500, error["Cause"])

    except Exception as e:
        print(e)
        return create_response(500, e)


def delete_if_exists(filePath, fileName, album_id):
    if key_exists(filePath):
        s3.delete_object(Bucket=s3_bucket_name, Key=filePath)
        print("s3 deletion executed")
    else:
        print("It is not in s3")

    # item = table.get_item(
    #     Key={
    #         'file_id': fileName,
    #         'album_id': album_id
    #     }
    # )
    # print(item)
    # print(fileName)
    # print(album_id)

    response = table.delete_item(
        Key={
            'file_id': fileName,
            'album_id': album_id
        }
    )
    print("dynamo deleteion executed")


def key_exists(mykey):
    s3_client = boto3.client('s3')
    try:
        response = s3_client.list_objects_v2(Bucket=s3_bucket_name, Prefix=mykey)
        for obj in response['Contents']:
            if mykey == obj['Key']:
                return 'exists'
        return False  # no keys match
    except KeyError:
        return False  # no keys found
    except Exception as e:
        # Handle or log other exceptions such as bucket doesn't exist
        return e
