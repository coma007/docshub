from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, album_table

from utils.response import create_response


def delete_album(event, context):
    try:
        album_path = event['albumPath']
        album_tokens = album_path.split("/")
        album_name = album_tokens[-1]
        album_path = ""
        for path in album_tokens:
            if (path == album_name):
                break
            album_path += path + "/"
        
        delete_album_recursive(album_path, album_name)
        
        return create_response(200, None)
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
            ":id": album_path + album_name + "/",
        },
    )
    
    for file in files["Items"]:
        print(file)