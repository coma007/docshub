import boto3
from . import aws_config

dynamodb = boto3.resource('dynamodb',
                          aws_access_key_id=aws_config.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=aws_config.AWS_SECRET_ACCESS_KEY,
                          region_name=aws_config.AWS_REGION)
table_name = 'file_metadata'
table = dynamodb.Table(table_name)
album_table_name = 'album_metadata'
album_table = dynamodb.Table(album_table_name)
