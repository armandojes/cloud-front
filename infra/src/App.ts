#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import Pipeline from './Pipeline';

const app = new cdk.App();

new Pipeline(app, 'ArmanDevelopFrontPipeline', {
  environmentName: 'develop'
});

new Pipeline(app, 'ArmanQualityFrontPipeline', {
  environmentName: 'quality'
});

new Pipeline(app, 'ArmanMasterFrontPipeline', {
  environmentName: 'master'
});