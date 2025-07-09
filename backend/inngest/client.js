const { Inngest } = require("inngest");

const inngest = new Inngest({
    id: 'stayfinder-backend',
    eventKey: process.env.INNGEST_EVENT_KEY
})

module.exports = { inngest };