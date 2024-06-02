import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as S3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import path from 'node:path';
import EnvironmentName from './contracts/EnvironmentName';
import addSuffix from './helpers/addSuffix';

interface StackProps extends cdk.StackProps {
  environmentName: EnvironmentName;
}

class Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const hostingBucket = new s3.Bucket(this, 'hostingBucket', {
      bucketName: addSuffix('arman-frontend-678', props.environmentName),
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const originAccess = new cloudfront.OriginAccessIdentity(this, 'HostingOriginAccess', {
      comment: `Origin Access Identity for ${hostingBucket.bucketName} bucket.`
    })

    hostingBucket.grantRead(originAccess);

    const distribution = new cloudfront.Distribution(this, 'CloudFrontArman', {
      comment: `CloudFront distribution - ${props.environmentName} environment.`,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(hostingBucket, {
          originAccessIdentity: originAccess,
        }),
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    })

    new S3Deployment.BucketDeployment(this, 'deploymentS3Arman', {
      destinationBucket: hostingBucket,
      sources: [S3Deployment.Source.asset(path.join(__dirname, '../../dist'))],
      distribution: distribution
    })
  }
}

export default Stack;