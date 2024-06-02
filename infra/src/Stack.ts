import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as S3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import path from 'node:path';

class Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostingBucket = new s3.Bucket(this, 'hosting-front-arman-678', {
      bucketName: 'hosting-front-arman-678',
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const originAccess = new cloudfront.OriginAccessIdentity(this, 'hosting-front-origin', {
      comment: 'access origin for hosting front'
    })

    hostingBucket.grantRead(originAccess);

    const distribution = new cloudfront.Distribution(this, 'cloudfront-front-arman', {
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

    new S3Deployment.BucketDeployment(this, 'deploy-front-arman', {
      destinationBucket: hostingBucket,
      sources: [S3Deployment.Source.asset(path.join(__dirname, '../../dist'))],
      distribution: distribution
    })
  }
}

export default Stack;