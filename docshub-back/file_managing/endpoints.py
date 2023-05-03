from db import table, s3, s3_bucket_name
from flask import  request, Blueprint

file_managing_endpoints = Blueprint('file_managing_endpoints', __name__)

@file_managing_endpoints.route('/api/upload-file', methods=['POST'])
def upload_file():
    album_id = request.json['albumId']
    file_id = request.json['fileName']
    file_size = request.json['fileSize']
    file_type = request.json['fileType']
    description = request.json['description']
    creation_date = request.json['dateOfCreation']
    tags = request.json['tags']

    try:
        table.put_item(Item={
            'album_id': album_id,
            'file_id': file_id,
            'file_size' : file_size,
            'file_type' : file_type,
            'name' : file_id,
            'description': description,
            'creation_date': creation_date,
            'last_change_date': creation_date,
            'tags': tags,
        })
    except Exception as e:
        print(f"Error inserting item into DynamoDB: {e}")
        s3.delete_object(Bucket=s3_bucket_name, Key=file_id)
        print(f"Deleted file {file_id} from S3")

    return ''

