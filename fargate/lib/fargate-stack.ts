import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import ecs = require('@aws-cdk/aws-ecs')
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns')

export class FargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "fargate-vpc", { maxAzs: 3 })

    const cluster = new ecs.Cluster(this, "fargate-cluster", { vpc })

    new ecs_patterns.LoadBalancedFargateService(this, "some-fargate-service", {
      cluster,
      cpu: 512,
      desiredCount: 1,
      image: ecs.ContainerImage.fromRegistry("chaosd/control-plane"),
      memoryLimitMiB: 1024,
      publicLoadBalancer: true,
      containerPort: Math.max(1024, Math.floor(Math.random() * 65500))
    })
  }
}
