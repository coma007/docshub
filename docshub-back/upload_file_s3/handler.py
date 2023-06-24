import base64
import os
import urllib

import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table

from utils.response import create_response

from cgi import parse_multipart, parse_header
from io import BytesIO

table = "meta"
s3_client = boto3.client('s3')
dynamo_client = boto3.client('dynamodb')


def upload_file_s3(event, context):
    try:
        # dynamo_client.query(
        #     TableName=table,
        #
        # )
        #
        # scanRecursive(table, table=dynamo_client)

        # bucket = event['Records'][0]['s3']['bucket']['name']
        # key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'])

        form_data = parse_request(event)
        print(form_data)

        local_file_path = "../.gitignore"
        s3_name = "asd/dummy"
        s3.upload_file(local_file_path, s3_bucket_name, s3_name)


        # get url
        # url = s3.generate_presigned_url(
        #     ClientMethod='get_object',
        #     Params={
        #         'Bucket': os.environ['BUCKET_NAME'],
        #         'Key': s3_file
        #     },
        #     ExpiresIn=24 * 3600
        # )
        # dest_key = str(date.today()) + '/' + key
        #
        # s3_client.copy_object(
        #     Bucket=DEST_BUCKET,
        #     Key=dest_key,
        #     CopySource=f'{bucket}/{key}'
        # )

        return create_response(200, "Succes")

    except Exception as e:
        raise Exception(e)

def parse_request(event):
    c_type, c_data = parse_header(event['headers']['Content-Type'])
    assert c_type == 'multipart/form-data'
    decoded_string = base64.b64decode(event['body'])
    # For Python 3: these two lines of bugfixing are mandatory
    # see also: https://stackoverflow.com/questions/31486618/cgi-parse-multipart-function-throws-typeerror-in-python-3
    c_data['boundary'] = bytes(c_data['boundary'], "utf-8")
    c_data['CONTENT-LENGTH'] = event['headers']['Content-length']
    return parse_multipart(BytesIO(decoded_string), c_data)

def scanRecursive(tableName, **kwargs):
    """
    NOTE: Anytime you are filtering by a specific equivalency attribute such as id, name
    or date equal to ... etc., you should consider using a query not scan

    kwargs are any parameters you want to pass to the scan operation
    """
    dbTable = dynamo_client.Table(tableName)
    response = dbTable.scan(**kwargs)
    if kwargs.get('Select') == "COUNT":
        return response.get('Count')
    data = response.get('Items')
    while 'LastEvaluatedKey' in response:
        response = kwargs.get('table').scan(ExclusiveStartKey=response['LastEvaluatedKey'], **kwargs)
        data.extend(response['Items'])
    return data
