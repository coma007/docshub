import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, album_table, table_name, album_table_name

from utils.response import create_response


def delete_album(event, context):
    print(event['body'])
    try:
        album_path = json.loads(event['body'])['albumPath']
        album_tokens = album_path.split("/")
        album_name = album_tokens[-1]
        album_path = ""
        for path in album_tokens:
            if (path == album_name):
                break
            album_path += path + "/"
        
        delete_album_recursive(album_path, album_name)
        
        return create_response(204, None)
    except Exception as e:
        return create_response(500, e)
        

def delete_album_recursive(album_path, album_name):
    print(album_path)
    print(album_name)
    response = album_table.get_item(
        Key={
            'parent_album_id': album_path,
            'album_id': album_name
        }
    )
    
    child_albums = album_table.query(
        KeyConditionExpression="parent_album_id = :id",
        ExpressionAttributeValues={
            ":id": album_path + album_name + "/",
        },
    )
    
    for child in child_albums["Items"]:
        delete_album_recursive(child["parent_album_id"], child["album_id"])
    
    files = table.query(
        KeyConditionExpression="album_id = :id",
        ExpressionAttributeValues={
            ":id": album_path + album_name,
        },
    )
    
    for file in files["Items"]:
        response = s3.delete_object(Bucket=s3_bucket_name, Key="public/" + file["album_id"] + file["file_name"])
        response = table.delete_item(
            TableName=table_name,
            Key={
                'album_id': file["album_id"],
                'file_id': file["file_id"]
            }
        )
    
    response = s3.delete_object(Bucket=s3_bucket_name, Key="public/" + album_path + album_name + "/")
    response = album_table.delete_item(
        TableName=album_table_name,
        Key={
            'album_id': album_name,
            'parent_album_id': album_path
        }
    )