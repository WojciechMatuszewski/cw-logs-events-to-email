import { CloudWatchLogsHandler } from "aws-lambda";
import { unzipSync } from "zlib";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({});

export const handler: CloudWatchLogsHandler = async event => {
  const zippedData = Buffer.from(event.awslogs.data, "base64");
  const unzippedData = unzipSync(zippedData).toString("utf8");

  await snsClient.send(
    new PublishCommand({
      Message: unzippedData,
      TopicArn: process.env.TOPIC_ARN,
      Subject: "CloudWatch Logs event"
    })
  );
};
