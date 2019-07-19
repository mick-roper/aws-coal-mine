#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { NetworkStack } from '../lib/network-stack';
import { EcsClusterStack } from '../lib/ecs-cluster-stack'
import { ChaosdServiceStack } from '../lib/fargate-service'

const props: cdk.StackProps = {
  env: {
    account: '',
    region: 'eu-west-1'
  },
  tags: {
    project: 'canary release testing'
  }
}

const app = new cdk.App();
const networkStack = new NetworkStack(app, 'chaosd-network', props);
const clusterStack = new EcsClusterStack(app, 'chaosd-cluster', { ...props, vpc: networkStack.vpc })
const chaosdServiceStackv1 = new ChaosdServiceStack(app, 'chaosd-service-v1', { ...props, cluster: clusterStack.cluster })

chaosdServiceStackv1.addDependency(clusterStack, 'the ecs cluster the app runs on')
clusterStack.addDependency(networkStack, 'the network the cluster runs on')