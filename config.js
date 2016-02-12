// RTPSTRMR SETTINGS (please configure)
// ------------------------------------------------------
var config = {
        
        // Address and Port of your HOMER-API Server
        API_SERVER: 'http://127.0.0.1',
        API_PATH: '/api/v1/stats/push',

        // Logfiles to monitor
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
