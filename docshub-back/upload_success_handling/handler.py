import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, dynamodb

from utils.response import create_response


permissions_table_name = 'permissions'
permissions_table = dynamodb.Table(permissions_table_name)


def handle_success(event, context):
    body = json.loads(event[0]["body"])
    album  = body["albumId"]
    file_name = body["albumId"] + "/" + body["fileName"]

    try:
        add_permission_if_needed(album, file_name)
        return create_response(200, "Success")

    except Exception as e:
        return create_response(500, e)


def add_permission_if_needed(album, file_path):
    
    parent_folders = album.split("/")
    for i in range(len(parent_folders), 0, -1):
        parent_folder_path = '/'.join(parent_folders[:i])
        print(parent_folder_path)
        
        
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
        print(permissions)
        for permission in permissions:
            try:
                if permission["full_access"]:
                    create_file_permission(permission["username"], file_path)
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
    
    print(result)

    return result

def access_exists(username, file_name):
    response = permissions_table.get_item(
        Key={
            'username': username,
            'file_name': file_name
        }
    )
    return 'Item' in response