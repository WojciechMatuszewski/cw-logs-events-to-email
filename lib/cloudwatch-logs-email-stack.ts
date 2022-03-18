import {
  aws_lambda_nodejs,
  aws_logs,
  aws_logs_destinations,
  aws_sns,
  aws_sns_subscriptions,
  Stack,
  StackProps
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";

export class CloudwatchLogsEmailStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new aws_lambda_nodejs.NodejsFunction(this, "Function", {
      entry: join(__dirname, "../src/handler.ts")
    });

    // If order of the emails matters, use FIFO topic
    const topic = new aws_sns.Topic(this, "Topic");
    topic.addSubscription(
      // Taken from 10-minute-mail
      new aws_sns_subscriptions.EmailSubscription("zmy96068@jiooq.com")
    );

    const fnDestination = new aws_lambda_nodejs.NodejsFunction(
      this,
      "fnDestination",
      {
        entry: join(__dirname, "../src/destination.ts"),
        environment: {
          TOPIC_ARN: topic.topicArn
        }
      }
    );
    topic.grantPublish(fnDestination);

    new aws_logs.SubscriptionFilter(this, "SubscriptionFilter", {
      // You could use Kinesis here but it might be an overkill.
      destination: new aws_logs_destinations.LambdaDestination(fnDestination),
      filterPattern: aws_logs.FilterPattern.allEvents(),
      logGroup: fn.logGroup
    });
  }
}
