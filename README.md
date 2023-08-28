# docshub


### Team members
[Nemanja Majstorović](github.com/Nemanja3314)  
[Nemanja Dutina](github.com/eXtremeNemanja)  
[Milica Sladaković](github.com/coma007)

### Table of Contents

- [Overview](#overview)
- [Features](#features)
    - [Authorization](#authorization)
    - [Storage Organization and Consistency](#storage-organization-and-consistency)
    - [Sharing](#sharing)
    - [Family Member Invite](#family-member-invite)
    - [Notifications](#notifications)
- [Wrap-Up](#wrap-up)

## Overview

**docshub** is a user-friendly app for cloud-based document storage. It's built on a serverless architecture, utilizing **Amazon Web Services (AWS)** with **Lambda functions** and **API Gateway** on the server side and **React** with **Amplify** on the client side.  

The app's main goal is to enable users manage their documents - uploading, editing, downloading, sharing, removing, and organized categorization of various document types.

## Features

### Authorization

To ensure secure access, docshub uses **AWS Cognito** User Pools to manage user authentication. Every user must be authorized before using any of the features.

Upon registration, users are automatically assigned to a docshub-users user group. This user group is configured with **IAM (Identity and Access Management) permission** that enables users to viewing their own content. This design enhances privacy and security, as each user can access and manage only their personal documents by default.

## Storage Organization and Consistency

Files within docshub are stored in **Amazon S3 (Simple Storage Service)**, while all the associated metadata is stored in **Amazon DynamoDB**. This metadata includes essential information such as file name, file type, creation date, last edited date, description, and tags.

Ensuring data consistency has been a priority. To address this, we've implemented a step-by-step approach using **AWS Step Functions**:

1. **Data Validation**: We begin by validating the data entered into the form. This includes checking for the right file type, size, and ensuring that all mandatory fields are filled out.
2. **Duplicate Check**: We verify if the file already exists. If it does, we prevent the user from entering a new file with the same name.
3. **Parallel Writes**: Simultaneously, we perform writes to both S3 and DynamoDB while observing any potential errors. If no errors occur, we proceed to the final step.
4. **Consistency Check**: In case an error arises, we maintain the consistency of data. If there's an issue during the writing process either to S3 or DynamoDB, we avoid partial writes. The file and the corresponding entry in the DynamoDB table remain intact.

This approach ensures that our system maintains a high level of consistency during both the upload and delete operations. If an error occurs during deletion in either S3 or DynamoDB, the respective file or entry in the table remains unchanged. Image bellow shows the algorithm:

![consistency](https://github.com/coma007/docshub/assets/76025555/08ff49e3-4fce-4118-a3d2-8a729359b84c)

### Sharing

Users can be granted permission to view specific files or entire albums of other users. Sharing permissions are stored directly in Amazon DynamoDB.  Users with permission to view other users' files are given read-only access, ensuring the security of documents.

When permissions are assigned to a user for an entire album, we automatically iterate through all the subalbums and subfiles of that album, granting the necessary permissions asynchronously. This ensures that if a user loses permission for a specific file within the album, their access rights remain consistent.

Upon signing in, users can see two tabs: "_My files_" and "_Files shared with me_." This division makes it easy to manage personal files and those that have been shared in an organized manner.


### Family Member Invite

When new users sign up for the first time, they have the option to enter a referral. This referral is like a request for family permission, which means access to view all the files belonging to the referring user.

Once a user sends a referral request, an email is sent to the referred family member. The email explains that the user who just signed up is requesting family permission to share their files. If the referred family member accepts the invitation, the new user gains access to view all of the referral's files. If the invitation is declined, no changes occur, and new user can still manage their own files without access to the referral's files.

To implement this, we've used **AWS Tasks** and **AWS Step Functions**, using notifications through the sharing action. 


### Notifications

Whenever a user successfully uploads, edits, or deletes a file, the system automatically generates a notification. This notification is then sent directly to the user's email address. The notification email provides basic information about the file, ensuring users stay updated on changes to their documents. 

To achieve this, we've used **AWS Simple Queue Service (SQS)** and **AWS Simple Notification Service (SNS)**. 

## Wrap-Up

In retrospect, the development of docshub provided a great learning experience in the domain of AWS cloud systems - ranging from serverless architecture and authentication via AWS Cognito to the intricacies of data management within S3 and DynamoDB. The implementation of advanced functionalities, including family member invitations and real-time notifications, underscored the practical application of AWS services.
