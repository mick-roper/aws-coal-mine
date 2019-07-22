import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import { Queue } from '@aws-cdk/aws-sqs'
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources'

export class CanaryStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new Queue(this, 'canary-traffic-updates', {
      queueName: 'canary-traffic-changes',
      retentionPeriod: cdk.Duration.days(1),
      deliveryDelay: cdk.Duration.minutes(1)
    })

    const fn = new lambda.Function(this, 'canary-function', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.entryPoint',
      code: lambda.Code.asset('./canary-fn')
    })

    fn.addEventSource(new SqsEventSource(queue))    
  }
}
