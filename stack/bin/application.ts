#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { NetworkStack } from '../lib/network-stack';
import { ChaosdServiceStack } from '../lib/fargate-service'

const props: cdk.StackProps = { 
  stackName: 'chaosd-control-plane', 
  env: {
    account: '',
    region: 'eu-west-1'
  },
  tags: {
    project: 'canary release testing'
  }
}

const app = new cdk.App();
const networkStack = new NetworkStack(app, 'NetworkStack', props);
const chaosdServiceStackv1 = new ChaosdServiceStack(app, 'ChaosdService-v1', { ...props, cluster: networkStack.cluster })
