from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, table_name

from utils.response import create_response


def validate(event, context):
    try:


        return create_response(204, None)
    except Exception as e:
        return create_response(500, e)