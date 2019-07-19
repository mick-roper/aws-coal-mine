import cdk = require('@aws-cdk/core')
import ecs = require('@aws-cdk/aws-ecs')
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns')

const getRandomPort = () => {
  const min = 20000, max = 65500

  return Math.floor((Math.random() * (max - min)) + min)
}

export interface ChaosdServiceStackProps extends cdk.StackProps {
  cluster: ecs.ICluster
}

export class ChaosdServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, name: string, props: ChaosdServiceStackProps) {
    super(scope, name, props)

    const port = getRandomPort()

    new ecsPatterns.LoadBalancedFargateService(this, 'chaosd-control-plane', {
      cluster: props.cluster,
      image: ecs.ContainerImage.fromRegistry('chaosd/control-plane'),
      cpu: 256,
      memoryLimitMiB: 512,
      serviceName: 'chaosd-control-plane',
      publicLoadBalancer: true,
      desiredCount: 1,
      containerPort: port,
      environment: {
        PORT: `${port}`
      }
    })
  }
}