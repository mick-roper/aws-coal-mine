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
const chaosdServiceStackv1 = new ChaosdServiceStack(app, 
  'chaosd-service-v1', 
  { 
    ...props, 
    cluster: sharedStack.cluster,
    domain: {
      name: 'controlplane.kotic.com',
      zoneId: 'Z3BHVK8AFSOXLX'
    }
  }
)

chaosdServiceStackv1.addDependency(sharedStack, 'the root stack')