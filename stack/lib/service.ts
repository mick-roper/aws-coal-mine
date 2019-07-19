import cdk = require('@aws-cdk/core')
import ecs = require('@aws-cdk/aws-ecs')
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns')

const getRandomPort = () => {
  const min = 20000, max = 65500

  return Math.floor((Math.random() * (max - min)) + min)
}

export interface ChaosdServiceStackProps extends cdk.StackProps {
  cluster: ecs.ICluster,
  image: string
}

export interface IServiceLoadBalancer {
  dnsName: string,
  hostedZoneId: string,
  arn: string
}

export class ChaosdServiceStack extends cdk.Stack {
  private readonly loadbalancer: IServiceLoadBalancer

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

    this.loadbalancer = {
      dnsName: service.loadBalancer.loadBalancerDnsName,
      hostedZoneId: service.loadBalancer.loadBalancerArn,
      arn: service.loadBalancer.loadBalancerArn
    }
  }
}