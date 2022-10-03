const { PubSub } = require("@google-cloud/pubsub");
const _ = require('lodash');

async function initPubsub(
    projectId = 'takuxi',
    topicNameOrId = process.env.PUB_SUB_TOPIC,
    subscriptionName = process.env.PUB_SUB_SUBSCRIPTION_NAME
) {
    const handler = {}

    try{
        // Instantiates a client
        const pubsub = new PubSub({projectId});
        const topic = await getTopic(pubsub, `projects/${projectId}/topics/${topicNameOrId}`);
        console.log(`Topic ${topicNameOrId} ready.`);
        const subscription = await getSubscription(topic, `projects/${projectId}/subscriptions/${subscriptionName}`);
        console.log(`subscription ${subscriptionName} ready.`);

        // // // Receive callbacks for new messages on the subscription
        subscription.on('message', message => {
            console.log(`Received message ${message.id}:`);
            console.log(`\tData: ${message.data}`);
            console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);
            const data = JSON.parse(message.data);
            if(handler[data.event]){
                handler[data.event](data);
            }else{
                console.error(`event ${data.event} not found`)
            }
            
            message.ack();
        });

        // // Receive callbacks for errors on the subscription
        subscription.on('error', error => {
            console.error('Received error:', error);
        });
        
        return {
            topic,
            subscription,
            handler,
        }

    }catch(e){
        console.error(e);
    }
}

async function getTopic(pubsub, name){
    const [topics] = await pubsub.getTopics();

    const existedTopic = _.find(topics ,(e)=> {
        return e.name == name;
    })

    if(existedTopic){
        return existedTopic;
    }
    const [topic] = await pubsub.createTopic(name);
    console.log(`Topic ${topic.name} created.`);
    return topic;
}

async function getSubscription(topic, name){
    const [subscriptions] = await topic.getSubscriptions();

    const existedSubscription = _.find(subscriptions, (e) => {
        return e.name = name;
    });

    if(existedSubscription){
        return existedSubscription;
    }

    const [subscription] = await topic.createSubscription(name);
    console.log(`Subscription ${subscription.name} created.`);
    return subscription;
}

module.exports = initPubsub