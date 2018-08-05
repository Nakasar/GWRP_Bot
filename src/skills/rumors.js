const axios = require('axios');

const { makeMessage, baseApi } = require('../utils');

getRumours = (message, phrase) => {
    return axios({
        method: 'get',
        baseURL: baseApi,
        url: '/rumours',
        params: { latest: 5 }
    }).then(function (json) {
        if (json.data.success) {
            var rumours = json.data.rumours
            var fields = [];
            for (var rumour of rumours) {
                fields.push({
                    name: rumour.name,
                    value: "*" + rumour.text + "*" + "\n[Voir sur la carte](https://gw2rp-tools.ovh/cartographe?id=" + rumour._id + "), par " + rumour.contact + "."
                });
            }
            return message.channel.send({
                embed: {
                    url: "https://gw2rp-tools.ovh/cartographe",
                    color: 45000,
                    author: {
                        name: "DERNIERES RUMEURS"
                    },
                    fields: fields
                }
            });
        }
    }).catch(function (json) {
        console.log(json);
    });
}

module.exports = {
    getRumours,
}