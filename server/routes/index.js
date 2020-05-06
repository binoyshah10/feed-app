const express = require('express');
const router  = express.Router();
const streamClient = require('../lib/stream');

router.get('/helloWorld', (req, res) => {
    return res.send('Hello World');
});

router.post('/addActivityToFeed', async (req, res) => {

    const persona = 'WorkerFeed' // req.body.persona;
    const personaId = req.body.id;
    const postMessage = req.body.postMessage;

    // Send data to stream
    worker1 = streamClient.feed(persona, personaId);
    activity = { actor: personaId, verb: 'tweet', object: 'query', message: postMessage };

    try {
        const activityResponse = await worker1.addActivity(activity);
        res.json({
            success: true,
            data: "Successfully posted to feed"
        })
    } catch(err) {
        console.log(err)
        res.status(err.status).json({
            success: false,
            data: "Could not post to feed"
        })
    }
})

router.get('/getFeed',async (req, res) =>{
    console.log(req.query)

    const persona = 'WorkerFeed' // req.query.persona;
    const personaId = req.query.id;

    user1 = streamClient.feed(persona, personaId);
    try {
        const feeds = await user1.get({ limit: 5 });
        console.log(feeds)
        res.json({
            success: true,
            data: "Successfully retrieved feeds",
            feedData: feeds
        })
    } catch(err) {
        console.log(err)
        res.status(err.status).json({
            success: false,
            data: "Could not post to feed"
        })
    }

})

router.get('/addMachineActivity', async (req, res) => {

    const persona = 'MachineFeed' // req.body.persona;
    const personaId = 'Machine1' //req.body.id;
    const postMessage = 'Production Rate: 400 units/s'//req.body.postMessage;

    // Send data to stream
    worker1 = streamClient.feed(persona, personaId);
    activity = { actor: personaId, verb: 'operation', object: 'query', message: postMessage };

    try {
        const activityResponse = await worker1.addActivity(activity);
        res.json({
            success: true,
            data: "Successfully posted to feed"
        })
    } catch(err) {
        console.log(err)
        res.status(err.status).json({
            success: false,
            data: "Could not post to feed"
        })
    }
})

router.get('/follow', async (req, res) => {

    worker1 = streamClient.feed('WorkerFeed', 'worker1');
    const response = await worker1.follow('MachineFeed', 'Machine1');
})



module.exports = router;