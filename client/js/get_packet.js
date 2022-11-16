function get_packet(event, type) {
    if (event.data.length >= type.length && event.data.substr(0, type.length) == type) {
        let r = event.data.substr(type.length, event.data.length - type.length);
        if (!r.length)
            return true;
        return r;
    }
    return (0);
}