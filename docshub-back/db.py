import boto3
import aws_config

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
