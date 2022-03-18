/**
 * Lambda function to push logs into CloudWatch Logs
 */
export const handler = () => {
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!")
  };

  return response;
};
