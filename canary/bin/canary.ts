#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CanaryStack } from '../lib/canary-stack';

const props: cdk.StackProps = {
  env: {
    region: 'eu-west-1'
  },
  tags: {
    project: 'canary-release'
  }
}

const app = new cdk.App();
new CanaryStack(app, 'CanaryStack', props);
