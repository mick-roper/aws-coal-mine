import { Stack, StackProps, Construct } from '@aws-cdk/core'
import { ICluster, ContainerImage } from '@aws-cdk/aws-ecs'
import { LoadBalancedFargateService, LoadBalancedServiceBase } from '@aws-cdk/aws-ecs-patterns'
import { AwsCustomResource, AwsSdkCall } from '@aws-cdk/custom-resources'

const getRandomPort = () => {
  const min = 20000, max = 65500

  return Math.floor((Math.random() * (max - min)) + min)
}

export interface ChaosdServiceStackProps extends StackProps {
  cluster: ICluster,
  image: string
}

export class ChaosdServiceStack extends Stack {
  constructor(scope: Construct, name: string, props: ChaosdServiceStackProps) {
    super(scope, name, props)

    const port = getRandomPort()

    const service = new LoadBalancedFargateService(this, "chaosd-service", {
      cluster: props.cluster,
      image: ContainerImage.fromRegistry(props.image),
      memoryLimitMiB: 512,
      cpu: 256,
      containerPort: port,
      environment: {
        PORT: `${port}`
      }
    })

    const createSdkCall: (subject: string, loadBalancer: LoadBalancedServiceBase) => AwsSdkCall = (subject: string, ecsService: LoadBalancedServiceBase) => ({
      service: 'SQS',
      action: 'sendMessage',
      physicalResourceId: props.stackName,
      parameters: {
        QueueUrl: 'https://sqs.eu-west-1.amazonaws.com/317464599277/canary-traffic-changes',
        DelaySeconds: 0,
        MessageBody: JSON.stringify({
          subject: subject,
          stack: props.stackName,
          serviceLoadBalancer: {
            dnsName: ecsService.loadBalancer.loadBalancerDnsName,
            zoneId: ecsService.loadBalancer.loadBalancerCanonicalHostedZoneId
          },
          publicDomain: {
            route53ZoneId: 'Z3BHVK8AFSOXLX',
            dnsName: 'control-plane.kotic.io'
          }
        })
      }
    })

    const canaryTopic = new AwsCustomResource(this, 'canary-trigger-topic', {
      onCreate: createSdkCall('STACK_CREATED', service),
      onUpdate: createSdkCall('STACK_UPDATED', service),
      onDelete: createSdkCall('STACK_DELETED', service)
    })

    canaryTopic.getData('helloworld')
  }
}