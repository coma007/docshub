from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, table_name

from utils.response import create_response


def delete_file(event, context):
    try:
        file_key = event['fileKey']
        response = s3.delete_object(Bucket=s3_bucket_name, Key="public/" + file_key)
        
        response = table.delete_item(
            TableName=table_name,
            Key={
                'album_id': 'ALBUM',
                'file_id': file_key
            }
        )
        
        return create_response(204, None)
    except Exception as e:
        return create_response(500, e)