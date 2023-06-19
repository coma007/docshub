import boto3
import json
import utils.aws_config as aws_config


def upload_file(event, context):
    s3 = boto3.client('s3',
                  aws_access_key_id=aws_config.AWS_ACCESS_KEY_ID,
                  aws_secret_access_key=aws_config.AWS_SECRET_ACCESS_KEY,
                  region_name=aws_config.AWS_REGION)
    s3_bucket_name = "docshub-files"

    dynamodb = boto3.resource('dynamodb',
                aws_access_key_id=aws_config.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=aws_config.AWS_SECRET_ACCESS_KEY,
                region_name=aws_config.AWS_REGION)
    table = dynamodb.Table('file_metadata')

    try:
        body = json.loads(event['body'])
        album_id = body['albumId']
        file_id = body['fileName']
        file_size = body['fileSize']
        file_type = body['fileType']
        description = body['description']
        creation_date = body['dateOfCreation']
        tags = body['tags']

        table = dynamodb.Table(table_name)
        table.put_item(Item={
            'album_id': album_id,
            'file_id': file_id,
            'file_size': file_size,
            'file_type': file_type,
            'name': file_id,
            'description': description,
            'creation_date': creation_date,
            'last_change_date': creation_date,
            'tags': tags
        })
    except Exception as e:
        print(f"Error inserting item into DynamoDB: {e}")
        s3.delete_object(Bucket=s3_bucket_name, Key=file_id)
        print(f"Deleted file {file_id} from S3")

    return {
        'statusCode': 200,
        'body': ''
    }
