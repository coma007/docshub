import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import album_table, dynamodb

from utils.response import create_response


permissions_table_name = 'permissions'
permissions_table = dynamodb.Table(permissions_table_name)


def create_album(event, context):
    try:
        body = json.loads(event['body'])
        parent_album_id = body['parentAlbumId']
        album_id = body['albumId']
        add_permission_if_needed(parent_album_id, album_id)
        album_name = body['albumName']

        s3.put_object(Bucket=s3_bucket_name, Key=(
            "public/" + parent_album_id + album_id + "/"), ContentType="application/x-directory")

        album_table.put_item(Item={
            'album_id': album_id,
            'parent_album_id': parent_album_id,
            'album_name': album_name
        })

        return create_response(200, body)

    except Exception as e:

        raise Exception(e)



def add_permission_if_needed(album, file_path):
    
    parent_folders = album.split("/")
    for i in range(len(parent_folders), 0, -1):
        parent_folder_path = '/'.join(parent_folders[:i])
        
        params = {
            'TableName': permissions_table_name,
            'IndexName': 'file_name-index',
            'KeyConditionExpression': 'file_name = :item_path',
            'ExpressionAttributeValues': {
                # Assuming file_name is of type 'S' (String)
                ':item_path': parent_folder_path + "/"
            }
        }
        permissions = permissions_table.query(**params)["Items"]
        for permission in permissions:
            try:
                if permission["full_access"]:
                    create_file_permission(permission["username"], album + file_path + "/")
            except Exception as e:
                print(e)
                return create_response(500, e)
                
                
def create_file_permission(username, file_name, full_access=False):

    if access_exists(username, file_name):

        return permissions_table.get_item(
                Key={
                    'username': username,
                    'file_name': file_name
                }
            )
    
    result = permissions_table.put_item(Item={
        'username' : username,
        'file_name' : file_name
    })
    


    return result

def access_exists(username, file_name):
    response = permissions_table.get_item(
        Key={
            'username': username,
            'file_name': file_name
        }
    )
    return 'Item' in response