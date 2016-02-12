// HEPIPE-JS SETTINGS (please configure)
// ------------------------------------------------------
var config = {
        
        // Address and Port of your HEP-API Server
        API_SERVER: 'http://127.0.0.1:9999',

        // the HEP ID and Authentication for this Agent
        // HEP_ID: '2099',
        // HEP_AUTH: 'HEProcks',

        // the Logfiles to monitor
        LOGS: [
                {
                  tag : 'rtp_stat',
                  host : 'rtp-probe-01',
		  pattern: 'rtp_stat',
                  path : '/var/log/rtpstat.log'
                }
              ]
};

// ------------------------------------------------------

module.exports = config;
