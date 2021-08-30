const dotenv = require('dotenv')
const fastify = require('fastify')
const { join } = require('path')



// Presets
dotenv.config()
const app = fastify({ logger: true })
const PORT = process.env.PORT || 3000

app.register(require('fastify-static'), {
    root: join(__dirname, 'static')
})

app.register(require('fastify-formbody'))

app.register(require('fastify-mailer'), {
  defaults: {from: 'Portfolio'},
  transport : {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  }
})

app.post('/', (request, reply) => {
  const { mailer } = app

  let message = `Name: ${request.body.full_name}
  Subject: ${request.body.subject}
  Email: ${request.body.mail}
  Message: ${request.body.essay}`

  mailer.sendMail({
    to: 'ololayinka15@gmail.com',
    subject: request.body.subject,
    text: message
  }, (errors, info) => {

    if (errors) {
      console.log(errors)
      reply.status(500)
      reply.send({
        status: 'error',
        message: 'Something went wrong'
      })
    }else{
      // console.log(info)
      reply.status(200)
      reply.direct('/')
      reply.send({
        status: 'OK',
        message: 'Message sent',
        info: {
          from: info.envelope.from,
          to: info.envelope.to
        }
      })
    }
  })
})



app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`))
