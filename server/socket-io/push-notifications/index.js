/* eslint-disable */
const webpush = require('web-push');
const Users = require('../../models/users');

const pushToUsers = (usersArray, message) => {
  Users.find({ _id: { $in: [usersArray] }, notify: true }).then((users) => {
    users.forEach((user) => {
        let parallelSubscriptionCalls = user.subscriptions.map((subscription) => {
            return new Promise((resolve, reject) => {
                const pushSubscription = {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.keys.p256dh,
                        auth: subscription.keys.auth
                    }
                };

                const pushPayload = JSON.stringify({
                    title: `Roles ${message.gameName}`,
                    message: `Nuova azione di ${message.sender}`,
                    icon: '/img/logos/dice128.png'
                })

                const pushOptions = {
                    vapidDetails: {
                        subject: 'https://www.roles.pw',
                        privateKey: process.env.VAPID_PRIVATE,
                        publicKey: process.env.VAPID_PUBLIC,
                    },
                    headers: {}, 
                };

                webpush.sendNotification(pushSubscription, pushPayload, pushOptions).then((value) => {
                    resolve({
                        status: true,
                        endpoint: subscription.endpoint,
                        data: value,
                    });
                }).catch((err) => {
                    user.removeSubscription(subscription);
                    return reject({
                        status: false,
                        endpoint: subscription.endpoint,
                        data: err,
                    });
                });
            });
        });
        Promise.all(parallelSubscriptionCalls).then((pushResults) => {
            console.info('Sent', pushResults.length)
        });
    });
    
    return 'Push triggered';
  }).catch(e => e);
  return usersArray;
};

module.exports = {
  pushToUsers,
};
