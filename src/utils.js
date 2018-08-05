function makeMessage(response, simple = false) {
    if (simple) {
        return response;
    }

    return {
        embed: {
            color: response.color || 5441619,
            description: response.text,
            fields: response.fields || null
        }
    };
}

module.exports = {
    makeMessage,
    baseApi: "https://gw2rp-tools.ovh/api"
}