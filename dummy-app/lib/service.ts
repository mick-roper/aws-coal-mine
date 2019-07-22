import  cdk = require('@aws-cdk/core')
import ecs = require('@aws-cdk/aws-ecs')
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns')
import customResources = require('@aws-cdk/custom-resources')

const getRandomPort = () => {
  const min = 20000, max = 65500

  return Math.floor((Math.random() * (max - min)) + min)
}

export interface ChaosdServiceStackProps extends cdk.StackProps {
  cluster: ecs.ICluster,
  image: string
}

export interface ServiceLoadBalancer {
  dnsName: string,
  hostedZoneId: string,
  listenerArn: string
}

export class ChaosdServiceStack extends cdk.Stack {
  private readonly loadbalancer: ServiceLoadBalancer

  constructor(scope: cdk.Construct, name: string, props: ChaosdServiceStackProps) {
    super(scope, name, props)

    const port = getRandomPort()

    const service = new ecsPatterns.LoadBalancedFargateService(this, "chaosd-service", {
      cluster: props.cluster,
      image: ecs.ContainerImage.fromRegistry(props.image),
      memoryLimitMiB: 512,
      cpu: 256,
      containerPort: port,
      environment: {
        PORT: `${port}`
      }
    })

    const canaryTopic = new customResources.AwsCustomResource(this, 'sns-topic', {
      onCreate: {
        service: 'SNS',
        action: 'publish',
        parameters: {
          TopicArn: 'arn:aws:sns:eu-west-1:317464599277:canary-trigger',
          Message: JSON.stringify({
            message: 'creating stack'
          })
        }
      }
    })

    canaryTopic.getData('helloworld')
  }
}