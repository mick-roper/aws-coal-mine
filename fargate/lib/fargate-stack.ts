import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import ecs = require('@aws-cdk/aws-ecs')
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns')

const getRandomPort = () => {
  const min = 30000
  const max = 65000

  return Math.floor(Math.random() * (max - min)) + min
}

export class FargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "fargate-vpc", { maxAzs: 3 })

    const cluster = new ecs.Cluster(this, "fargate-cluster", { vpc })

    const containerPort = getRandomPort()

    const service = new ecs_patterns.LoadBalancedFargateService(this, "some-fargate-service", {
      cluster,
      cpu: 512,
      desiredCount: 1,
      image: ecs.ContainerImage.fromRegistry("chaosd/control-plane"),
      memoryLimitMiB: 512,
      publicLoadBalancer: true,
      environment: {
        PORT: '80'
      }
    })
  }
}
