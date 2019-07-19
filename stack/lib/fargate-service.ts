import cdk = require('@aws-cdk/core')
import ecs = require('@aws-cdk/aws-ecs')
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns')

export interface ChaosdServiceStackProps extends cdk.StackProps {
  cluster: ecs.ICluster
}

export class ChaosdServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, name: string, props: ChaosdServiceStackProps) {
    super(scope, name, props)

    new ecsPatterns.LoadBalancedFargateService(this, 'chaosd-control-plane', {
      cluster: props.cluster,
      image: ecs.ContainerImage.fromRegistry('chaosd/control-plane'),
      cpu: 256,
      memoryLimitMiB: 256,
      serviceName: 'chaosd-control-plane',
      publicLoadBalancer: true,
    })
  }
}