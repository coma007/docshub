import boto3
import aws_config
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

dynamodb = boto3.resource('dynamodb',
			aws_access_key_id=aws_config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=aws_config.AWS_SECRET_ACCESS_KEY,
            region_name=aws_config.AWS_REGION)
table = dynamodb.Table('file_metadata')

@app.route('/api/upload-file', methods=['POST'])
def upload_file():
    album_id = request.json['albumId']
    file_id = request.json['fileName']
    file_size = request.json['fileSize']
    file_type = request.json['fileType']
    description = request.json['description']
    creation_date = request.json['dateOfCreation']
    tags = request.json['tags']

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

    return ''

