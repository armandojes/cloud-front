import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { LinuxBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { Construct } from 'constructs';
import addSuffix from './helpers/addSuffix';
import EnvironmentName from './contracts/EnvironmentName';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import getConfigFileName from './helpers/getConfigFileName';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import Stage from './Stage'

interface PipelineProps extends cdk.StackProps {
  environmentName: EnvironmentName;
}

class Pipeline extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    const artifactsBucket = new Bucket(this, 'armando-artifacts-front', {
      bucketName: addSuffix('armando-artifacts-front', props.environmentName),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    const pipeline = new pipelines.CodePipeline(this, 'ArmandFrontPipeline', {
      pipelineName: addSuffix('ArmandFrontPipeline', props.environmentName),
      artifactBucket: artifactsBucket,
      synth: new pipelines.CodeBuildStep('CompileInfraAndCode', {
        rolePolicyStatements: [
          new PolicyStatement({
            actions: ['kms:Decrypt', 'ssm:GetParameter'],
            resources: ['*'],
          }),
        ],
        buildEnvironment: {
          buildImage: LinuxBuildImage.STANDARD_7_0,
          environmentVariables: {
            'NODE_VERSION': {
              value: '14',
            },
          },
        },
        input: pipelines.CodePipelineSource.gitHub('armandojes/cloud-front', props.environmentName),
        commands: [
          'node -v',
          `aws ssm get-parameter --name ${getConfigFileName(props.environmentName)} --with-decryption --query 'Parameter.Value' --output text > src/config.js`,
          'npm ci',
          'npm run build',
          'cd infra',
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
        primaryOutputDirectory: 'infra/cdk.out',
      })
    })


    pipeline.addStage(new Stage(this, 'ArmanDevFrontStage', {
      environmentName: props.environmentName
    }))
  }
}

export default Pipeline;