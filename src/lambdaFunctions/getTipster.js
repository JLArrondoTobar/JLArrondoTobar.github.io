'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2"});

exports.handler = async (event, context) => {
    const ddbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "eu-west-2"});

    let responseBody = '';
    let statusCode = 0;

    const { id } = event.pathParameters;

    const params = {
        TableName: "tipsters",
        Key: {
            id: id
        }
    }
    try {
        const data = await documentClient.get(params).promise();
        responseBody = JSON.stringify(data.Item);
        statusCode = 200;
    } catch (error) {
        responseBody = 'Unable to get Tipster';
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "test"
        },
        body: responseBody
    }
    return response;
}
