from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, table_name

from utils.response import create_response


def delete_file(event, context):
    try:
        file_key = event['fileKey']
        file_tokens = file_key.split("/")
        file_key = file_tokens[-1]
        album_id = ""
        for key in file_tokens:
            if key == file_key:
                break
            album_id += key + "/"
        response = s3.delete_object(Bucket=s3_bucket_name, Key="public/" + album_id + file_key)
        album_id = album_id[:-1]
        files = table.query(
            KeyConditionExpression="album_id = :id",
            ExpressionAttributeValues={
                ":id": album_id,
            },
        )
        
        for item in files["Items"]:
            if item["file_name"] == file_key:
                response = table.delete_item(
                    TableName=table_name,
                    Key={
                        'album_id': album_id,
                        'file_id': item["file_id"]
                    }
                )
                break

        return create_response(204, None)
    except Exception as e:
        return create_response(500, e)