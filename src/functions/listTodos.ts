import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { document } from '../utils/dynamodbClient';

export const handle = async (event) => {
  const { userId } = event.pathParameters;

  const response = await document
    .scan({
      TableName: 'todos',
      FilterExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
    .promise();

  const userTodos = response.Items;
  console.log(userTodos);

  return {
    statusCode: 200,
    body: JSON.stringify(userTodos),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
