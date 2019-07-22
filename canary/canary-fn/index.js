const aws = require('aws-sdk')

const sqs = new aws.SQS()

const processRecord = async record => {
  const { body } = record

  if (!body) {
    console.warn('no message body')
    return
  }

  const { subject, stack, serviceLoadBalancer, publicDomainName } = JSON.parse(body)

  // todo: do something useful with this
  console.log(JSON.stringify({ subject, stack, serviceLoadBalancer, publicDomainName }))
}

module.exports.entryPoint = async event => {
  const { Records = [] } = event

  await Promise.all(Records.map(processRecord))
}