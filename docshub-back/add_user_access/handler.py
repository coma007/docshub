import boto3
from boto3.dynamodb.conditions import Key

from utils.dynamodb_config import dynamodb, table, table_name
from utils.response import create_response

permissions_table_name = 'permissions'
permissions_table = dynamodb.Table(permissions_table_name)

def add_user_access(event, context):

    users = event['users']
    file_name = event['fileKey']


    try:
        results = []
        
        if file_name.endswith("/"):
            for user in users:
                results.append(create_album_permission(user, file_name))
        else:
            for user in users:
                results.append(create_file_permission(user, file_name))

        return create_response(200, results)
        
    except Exception as e:
        return create_response(500, e)


def create_album_permission(username, file_name):
    albums = set()
    items = table.scan()['Items']
    for item in items:
        if item['album_id'].startswith(file_name[:-1]):
            albums.add(item['album_id'])
    files = []
    results = []
    for album in albums:
        files += table.query(
                KeyConditionExpression=Key('album_id').eq(album)
        )["Items"]
        results.append(create_file_permission(username, album + "/"))
        
    for file in files:
        results.append(create_file_permission(username, file["album_id"] + "/" + file["file_name"]))
    return results


def create_file_permission(username, file_name):
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