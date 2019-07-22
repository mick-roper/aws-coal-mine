#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CanaryStack } from '../lib/canary-stack';

const app = new cdk.App();
new CanaryStack(app, 'CanaryStack');
