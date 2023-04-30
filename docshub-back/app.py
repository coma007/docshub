import boto3
import aws_config
from flask import Flask, request

app = Flask(__name__)

dynamodb = boto3.resource('dynamodb',
			aws_access_key_id=aws_config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=aws_config.AWS_SECRET_ACCESS_KEY,
            region_name=aws_config.AWS_REGION)
table = dynamodb.Table('file_metadata')

@app.route('/api/upload-file', methods=['POST'])
def upload_file():
    album_id = request.json['albumId']
    file_id = request.json['fileId']
    file_size = request.json['size']
    file_type = request.json['type']
    name = request.json['name']
    description = request.json['description']
    creation_date = request.json['date']
    tags = request.json['tags']

    table.put_item(Item={
        'album_id': '1',
        'file_id': 'file_id',
        'file_size' : 'file_size',
        'file_type' : 'file_type',
	    'name' : 'name',
        'description': 'description',
        'creation_date': 'creation_date',
        'last_change_date': 'creation_date',
        'tags': 'tags',
    })

    return ''

