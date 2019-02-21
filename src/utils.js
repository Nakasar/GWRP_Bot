function makeMessage(response, simple = false) {
    if (simple) {
        return response;
    }

    const embed = {
        title: response.title,
        color: response.color || 5441619,
        description: response.text,
    };

    if (response.fields && Array.isArray(response.fields)) {
        embed.fields = response.fields;
    }

    if (response.thumbnail) {
        embed.thumbnail = {
            url: response.thumbnail,
        };
    }

    return { embed };
}

module.exports = {
    makeMessage,
    baseApi: "https://gw2rp-tools.ovh/api"
};
