import boto3
import json

from utils.s3_config import s3, s3_bucket_name
from utils.dynamodb_config import table, table_name

client = boto3.client('cognito-idp')
from utils.response import create_response


def on_change(event, context):
    try:
        for record in event["Records"]:
            subject = record["Sns"]["Subject"]
            messages = json.loads(record["Sns"]["Message"])
            for message in messages["Records"]:
                event_name = message["eventName"]
                # print(event_name)
                tokens = message["s3"]['object']['key'].split("/")
                file_changed = tokens[-1]
                sub = tokens[1]
                receiver_email = find_user(sub)
                send_email("docshub.noreply@gmail.com", receiver_email, get_subject(event_name),
                           "Operation executed on " + file_changed)

    except Exception as e:
        print(e)
        return create_response(500, e)


def find_user(sub):
    response = client.list_users(
        UserPoolId="eu-central-1_PQInK2hdy",
        AttributesToGet=[
            'email', 'sub'
        ]
    )
    user_attributes = [user["Attributes"] for user in response["Users"]]
    for sub_attr, email_attr in user_attributes:
        print(email_attr)
        print(sub_attr)
        if sub_attr["Value"] == sub:
            return email_attr["Value"]


def get_subject(event_name):
    if "objectcreated" in event_name.lower():
        return "Object was created"
    elif "objectremoved" in event_name.lower():
        return "Object was deleted"
    else:
        return "eventName"


def send_email(sender, recipient, subject, body):
    # Replace sender@example.com with your "From" address.
    # This address must be verified with Amazon SES.
    SENDER = sender

    # Replace recipient@example.com with a "To" address. If your account
    # is still in the sandbox, this address must be verified.
    RECIPIENT = recipient

    # Specify a configuration set. If you do not want to use a configuration
    # set, comment the following variable, and the
    # ConfigurationSetName=CONFIGURATION_SET argument below.
    # CONFIGURATION_SET = "ConfigSet"

    # If necessary, replace us-west-2 with the AWS Region you're using for Amazon SES.
    AWS_REGION = "eu-central-1"

    # The subject line for the email.
    SUBJECT = subject

    # The email body for recipients with non-HTML email clients.
    BODY_TEXT = body

    # The HTML body of the email.
    BODY_HTML = "<html><head></head><body><h1>An operation happened in you bucket </h1><p> {}</p></body> </html>".format(
        BODY_TEXT)

    # The character encoding for the email.
    CHARSET = "UTF-8"

    # Create a new SES resource and specify a region.
    client = boto3.client('ses', region_name=AWS_REGION)

    # Try to send the email.
    try:
        # Provide the contents of the email.
        print("AAAAAAAAAAAA")
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    RECIPIENT,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': BODY_HTML,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER,
            # If you are not using a configuration set, comment or delete the
            # following line
            # ConfigurationSetName=CONFIGURATION_SET,
        )
    # Display an error if something goes wrong.
    except Exception as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])