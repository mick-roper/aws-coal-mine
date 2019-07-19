#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { SharedStack } from '../lib/common'
import { ChaosdServiceStack } from '../lib/service'

const props: cdk.StackProps = {
  env: {
    region: 'eu-west-1'
  },
  tags: {
    project: 'canary release testing'
  }
}

const app = new cdk.App();
const sharedStack = new SharedStack(app, 'shared-stuff', props)
const chaosdServiceStackv0_1_34 = new ChaosdServiceStack(app, 
  'chaosd-service-0-1-34', 
  { 
    ...props, 
    cluster: sharedStack.cluster, 
    image: 'chaosd/control-plane:0.1.34'
  })

const chaosdServiceStackv0_1_35 = new ChaosdServiceStack(app, 
  'chaosd-service-0-1-35', 
  { 
    ...props, 
    cluster: sharedStack.cluster, 
    image: 'chaosd/control-plane:0.1.35'
  })

chaosdServiceStackv0_1_34.addDependency(sharedStack, 'the root stack')
chaosdServiceStackv0_1_35.addDependency(sharedStack, 'the root stack')