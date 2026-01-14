import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";

const cloudfrontClient = new CloudFrontClient({ profile: "nodejs" });

const command = new CreateInvalidationCommand({
  DistributionId: "E91MS89NUB3N4",
  InvalidationBatch: {
    CallerReference: "1234",
    Paths: {
      Quantity: 1,
      Items: ["/images/thumnail.png"],
    },
  },
});

const response = await cloudfrontClient.send(command);
console.log(response);
