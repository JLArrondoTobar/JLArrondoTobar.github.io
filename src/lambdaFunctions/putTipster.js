'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2"});

exports.handler = async (event, context) => {
    const ddbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "eu-west-2"});
    
    let responseBody = '';
    let statusCode = 0;

    const { id, name, bank, valuePerUnit, currency, bookie } = JSON.parse(event.body);

    const params = {
        TableName: "tipsters",
        Item: {
            id: id,
            name: name,
            bank: bank,
            valuePerUnit: valuePerUnit,
            currency: currency,
            bookie: bookie

        }
    }
    try {
        const data = await documentClient.put(params).promise();
        responseBody = JSON.stringify(data);
        statusCode = 201;
    } catch (error) {
        responseBody = 'Unable to save Tipster';
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
