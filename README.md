# Junction-X-Seoul Team Chobo
## **Installing**

using npm

```bash
$ npm install
```

using yarn

```bash
$ yarn install
```

## **Deployment**

If a change in code is detected, the deployment pipeline work as below.

1. `AWS Codecommit` capture a change then notice to `AWS Codebuild`
2. `AWS Codebuild` get the source from `Github` then execute a build script
3. When building success, `Codebuild` sends artifacts to `AWS Elastic Beanstalk` to deploy to Scaling Group.
4. When deploying success, `AWS Cloudwatch` call `AWS Lambda Function`
5. `AWS Lambda` Function sends an alarm to `Slack Channel`.
6. When the build fails, Codebuild deprecates the source. Then it runs process no.4 and no.5

## Architecture

Based on a layered architecture that composed of repository, service, controller.

## Testability

To gain testability, dependency has been injected into contactor between layers.

For a in-memory test, query builder has been selected rather than ORM.

https://www.youtube.com/watch?v=CuN09s39ceU&feature=emb_logo
