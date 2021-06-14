import { v4 as uuidv4 } from 'uuid';
import { document } from '../utils/dynamodbClient';
import { APIGatewayProxyHandler } from 'aws-lambda';

interface ICreateTodo {
  title: string;
  done: boolean;
  deadline: Date;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { title, done, deadline } = JSON.parse(event.body) as ICreateTodo;

  const { userId } = event.pathParameters;

  await document
    .put({
      TableName: 'todos',
      Item: {
        id: uuidv4(),
        userId,
        title,
        done,
        deadline: new Date(deadline).toISOString(),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Todo created',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
