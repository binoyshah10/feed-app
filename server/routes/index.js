const express = require('express');
const router  = express.Router();
const streamClient = require('../lib/stream');
const credentials = require('../users.json')

router.post('/addActivityToFeed', async (req, res) => {

    const userType = req.body.userType
    const username = req.body.username;
    const postMessage = req.body.postMessage;

    const feedName = userType === 'worker' ? 'WorkerFeed' : 'MachineFeed';

    // Send data to stream
    const userFeed = streamClient.feed(feedName, username);
    const activity = { actor: username, verb: 'post', object: 'post', message: postMessage, type: userType };

    try {
        const activityResponse = await userFeed.addActivity(activity);
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

    const userType = req.query.userType;
    const username = req.query.username;
    const feedName = userType === 'worker' ? 'WorkerFeed' : 'MachineFeed';

    const userFeed = streamClient.feed(feedName, username);
    
    try {
        const feeds = await userFeed.get({ limit: 10,  reactions: { recent: true, counts: true } });
        res.json({
            success: true,
            data: "Successfully retrieved feeds",
            feedData: feeds
        })
    } catch(err) {
        console.log(err)
        res.status(err.status).json({
            success: false,
            data: "Could not retrieve feed"
        })
    }

})

router.get('/addMachineActivity', async (req, res) => {

    const persona = 'MachineFeed' // req.body.persona;
    const personaId = 'Machine1' //req.body.id;
    const postMessage = 'Machine 1 raising alert'//req.body.postMessage;

    // Send data to stream
    worker1 = streamClient.feed(persona, personaId);
    activity = { actor: personaId, verb: 'info', object: 'query', message: postMessage, type:'machine' };

    worker1_notification = streamClient.feed('Notifications', 'worker1');
    activity_notification = { actor: personaId, verb: 'info', object: 'post', message: 'Warning for high temperature', type:'machine' };

    try {
        const activityResponse = await worker1.addActivity(activity);
        const notifcationResponse = await worker1_notification.addActivity(activity_notification);
        // console.log(notifcationResponse)
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

router.post('/checkIfFollowed', async (req, res) => {

    const username = req.body.username;
    const userType = req.body.userType;
    const userFeedName = userType === 'worker' ? 'WorkerFeed' : 'MachineFeed';

    const followedUsername = req.body.followedUsername;
    const followedUserType = req.body.followedUserType;
    const followedFeedName = followedUserType === 'worker' ? 'WorkerFeed' : 'MachineFeed';

    try {
        userFeed = streamClient.feed(userFeedName, username);
        let response = await userFeed.following();

        let followed = false;
        response.results.forEach(data => {
            if (data.target_id.split(':')[1] === followedUsername) {
                followed = true;
                res.json({
                    success: true,
                    message: "User is followed",
                })
            }
        })

        if (followed === false) {
            res.json({
                success: true,
                message: "User is not followed",
            })
        }
    } catch(err) {
        console.log(err);
        res.status(err.status).json({
            success: false,
            message: "Error in checkIfFollowed"
        })
    }
})

router.post('/follow', async (req, res) => {

    const username = req.body.username;
    const userType = req.body.userType;
    const userFeedName = userType === 'worker' ? 'WorkerFeed' : 'MachineFeed';

    const followedUsername = req.body.followedUsername;
    const followedUserType = req.body.followedUserType;
    const followedFeedName = followedUserType === 'worker' ? 'WorkerFeed' : 'MachineFeed';

    try {
        userFeed = streamClient.feed(userFeedName, username);
        const response = await userFeed.follow(followedFeedName, followedUsername);
        console.log(response);
        res.json({
            success: true,
            data: "Successfully followed user"
        })
    } catch(err) {
        console.log(err);
        res.status(err.status).json({
            success: false,
            data: "Could not follow"
        })
    }
})

router.post('/unfollow', async (req, res) => {

    const username = req.body.username;
    const userType = req.body.userType;
    const userFeedName = userType === 'worker' ? 'WorkerFeed' : 'MachineFeed';

    const followedUsername = req.body.followedUsername;
    const followedUserType = req.body.followedUserType;
    const followedFeedName = followedUserType === 'worker' ? 'WorkerFeed' : 'MachineFeed';

    try {
        userFeed = streamClient.feed(userFeedName, username);
        const response = await userFeed.unfollow(followedFeedName, followedUsername);
        console.log(response)
        res.json({
            success: true,
            data: "Successfully unfollowed user"
        })
    } catch(err) {
        console.log(err);
        res.status(err.status).json({
            success: false,
            data: "Could not unfollow"
        })
    }
})

router.post('/addCommenttoactivity', async (req, res) => {

    console.log(req.body)
    const activityid = req.body.actID;
    // then let's add a like reaction to that activity
    try{
        const response = await streamClient.reactions.add("comment", activityid, {'actor': req.body.userName, 'userType': req.body.userType, 'comment': req.body.comment}, {userId: req.body.userName});
        res.json({
            success: true,
            data: "Successfully posted to feed"
        })
    }
    catch(err){
        console.log(err)
        res.status(err.status).json({
            success: false,
            data: "Could not comment"
        })
    }
})

router.post('/addLiketoactivity', async (req, res) => {

    const activityid = req.body.actID;
    try{
    const response = await streamClient.reactions.add("like", activityid, {'actor': req.body.userName, 'userType': req.body.userType}, {userId: req.body.userName});
    res.json({
        success: true,
        data: "Successfully posted to feed"
    })
    }
    catch(err){
        console.log(err)
        // res.status(err.status).json({
        //     success: 7,
        //     data: "Could not like"
        // })
    }
})


router.post('/addigotthis', async (req, res) => {
    const activityid = req.body.actID;
    try{
    const response = await streamClient.reactions.add("gotthis", activityid, {'actor': req.body.userName, 'userType': req.body.userType}, {userId: req.body.userName});
    res.json({
        success: true,
        data: "Successfully posted to feed"
    })
    }
    catch(err){
        console.log(err)
    }
})

router.get('/getFollowingFeeds', async (req, res) => {

    const userType = req.query.userType;
    const username = req.query.username;
    const feedName = userType === 'worker' ? 'WorkerFeed' : 'MachineFeed';
    
    const userFeed = streamClient.feed(feedName, username);
    
    try {
        const following = await userFeed.following({ limit: 10 });
        const followingList = [];
        following.results.map(data => {
            const username = data.target_id.split(':')[1];
            followingList.push({
                username: username,
                name: credentials[username]["name"],
                userType: credentials[username]["type"]
            })
        })
        res.json({
            success: true,
            following: followingList
        })
    } catch(err) {
        console.log(err)
        res.status(err.status).json({
            success: false,
            data: "Could not retrieve followers"
        })
    }
})

router.get('/getStreamToken', (req, res) => {

    const userToken = streamClient.createUserToken('worker1');
    console.log(userToken)
    res.json({
        success: true,
        data: userToken
    })
})

router.post('/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    
    if(username in credentials){
        if(credentials[username].password == password){
            console.log('You are in!');
            const streamToken = streamClient.createUserToken(username);
            res.json({
                success: true,
                user: {
                    username: username,
                    name: credentials[username].name,
                    type: credentials[username].type,
                    streamToken: streamToken
                }
            })
        }
        else{
            console.log('Incorrect Credentials');
            res.status(400).json({
                success: false,
                message: 'Incorrect username or password'
            })
        }
    }


})

router.get('/getNotifications', async (req, res) => {

    const username = req.query.username;
    const feedName = 'Notifications';

    const notificationsFeed = streamClient.feed(feedName, username);
    
    try {
        const notifications = await notificationsFeed.get({ limit: 10 });
        res.json({
            success: true,
            notifications: notifications
        })
    } catch(err) {
        console.log(err)
        res.status(err.status).json({
            success: false,
            data: "Could not retrieve notifications"
        })
    }
})

router.get('/markNotificationSeen', async (req, res) => {

    const username = req.query.username;
    const feedName = 'Notifications';

    const notificationsFeed = streamClient.feed(feedName, username);
    
    try {
        const notifications = await notificationsFeed.get({mark_seen:true, mark_read: true});
        res.json({
            success: true,
            data: "Successfully retrieved notifications",
            notifications: notifications
        })
    } catch(err) {
        console.log(err)
        res.status(err.status).json({
            success: false,
            data: "Could not retrieve feed"
        })
    }

})

router.get('/searchUser', (req, res) => {

    const username = req.query.username;
    const matchedUsernames = []

    Object.entries(credentials).map(([key, value]) => {
        if (key.toLowerCase().includes(username.toLowerCase()) || value.name.toLowerCase().includes(username.toLowerCase())) {
            const entry = { value: value, label: value.name }
            matchedUsernames.push(entry);
        }
    })
    res.json({
        success: true,
        data: matchedUsernames
    })
})


module.exports = router;