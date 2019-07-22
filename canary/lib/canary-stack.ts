import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import { Topic } from '@aws-cdk/aws-sns'
import { SnsEventSource } from '@aws-cdk/aws-lambda-event-sources'

export class CanaryStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new Topic(this, 'canary-trigger', {
      topicName: 'canary-trigger',
      displayName: 'Canary Deployment Trigger'
    })

    const fn = new lambda.Function(this, 'canary-function', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.entryPoint',
      code: lambda.Code.asset('../canary-fn')
    })

    fn.addEventSource(new SnsEventSource(topic))    
  }
}
