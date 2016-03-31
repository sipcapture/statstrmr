// RTPSTRMR SETTINGS (please configure)
// ------------------------------------------------------
var config = {

        // Address and Port of your HOMER-API Server
        API_SERVER: 'http://127.0.0.1',
        API_PATH: '/api/v1/stats/push',

        // Logfiles to monitor
        SCRIPTS: [
                {
		  name: 'CPU Stats',
                  timer : 5000, // milliseconds
		  exec: function(){
			var os = require("os");
			var cpu = os.cpus();
			var counter = 0; var total=0;
			var free=0; var sys=0; var user=0;

			for (var i = 0; i<cpu.length ; i++) {
			    counter++;
			    total=parseFloat(cpu[i].times.idle)+parseFloat(cpu[i].times.sys)+parseFloat(cpu[i].times.user)+parseFloat(cpu[i].times.irq)+parseFloat(cpu[i].times.nice);
			    free+=100*(parseFloat(cpu[i].times.idle)/total);
			    sys+=100*(parseFloat(cpu[i].times.sys)/total);
			    user+=100*(parseFloat(cpu[i].times.user)/total);
			};

			// Return JSON object
			var doc = { 'cpu_idle': (free/counter).toFixed(0), 'cpu_user': (user/counter).toFixed(0), 'cpu_system': (sys/counter).toFixed(0), 'cpu_count': counter };
			return JSON.stringify(doc);
		  }
                }
              ]
};

// ------------------------------------------------------

module.exports = config;
