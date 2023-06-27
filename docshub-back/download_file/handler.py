import boto3
import json
import base64

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table

from utils.response import create_response


def download_file(event, context):
    try:
        file_key = event['fileKey']
        response = s3.get_object(Bucket=s3_bucket_name, Key="public/" + file_key)

        file_data = base64.b64encode(response.get("Body").read()).decode("utf-8")

        return {
            'statusCode': 200,
            'body': file_data,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': response['ContentType'],
                'Content-Disposition': f'attachment; filename={file_key}'
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(e, default=str)
        }
