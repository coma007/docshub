import boto3
from flask import Flask, request

app = Flask(__name__)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('FileMetadata')

@app.route('/api/upload-file', methods=['POST'])
def upload_file():
    file_id = request.json['fileId']
    file_size = request.json['size']
    file_type = request.json['type']
    name = request.json['name']
    description = request.json['description']
    creation_date = request.json['date']
    tags = request.json['tags']

    # Store the file metadata in DynamoDB
    table.put_item(Item={
        'file_id': file_id,
        'file_size' : file_size,
        'file_type' : file_type,
	'name' : name,
        'description': description,
        'creation_date': creation_date,
        'last_change_date': creation_date,
        'tags': tags,
    })

    return ''

