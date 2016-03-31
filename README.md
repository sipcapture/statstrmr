<img src="https://i.imgur.com/scqdu3p.png" width="400">

# statstrmr
#### _JSON-HEP_ Statistics Streamer for HOMER 5.x

<img src="http://i.imgur.com/74Gswvq.gif" />

### Description

**statstrmr** is a simple PoC tool to stream HEP-JSON formatted statistics to a HOMER 5 [HTTP API](https://github.com/sipcapture/homer/wiki/Example%3A-CustomStats) Instance <br>
JSON statistics can be extracted from streaming logs, or generated in cycles by custom node scripts

### Status

* Status: Experimental

### Install
<pre>
npm install
</pre>

### Config
Fork and edit ```config.js``` or ```config_scripts.js``` with your HOMER ```API_SERVER``` and ```API_PATH``` details<br>
<pre>
cp config.js myconfig.js
</pre>

--------------------

#### :page_with_curl: SCRIPTS 
##### Link: [working example](https://github.com/sipcapture/statstrmr/blob/master/config_scripts.js)
Each SCRIPTS entry defines a timed function returning a valid JSON object

<pre>
var config = {
        API_SERVER: 'http://127.0.0.1',
        API_PATH: '/api/v1/stats/push',
        SCRIPTS: [
                {
                  name: 'Custom Stats',
                  timer : 5000, // milliseconds
                  exec: function(){
                        var value = // YOUR CODE HERE
                        var doc = { 'key': value };
                        return JSON.stringify(doc);
                  }
                }
              ]

};
</pre>

--------------------

#### :page_facing_up: LOGS 
##### Link: [working example](https://github.com/sipcapture/statstrmr/blob/master/config.js)
Each LOGS entry points at a log streaming valid JSON strings and requires/defines a log path and a _(regex)_ **pattern** to match the "type" field from each JSON object

<pre>
var config = {
        API_SERVER: 'http://127.0.0.1',
        API_PATH: '/api/v1/stats/push',
        LOGS: [
                {
                  tag : 'custom_tag',
                  host : 'your_hostname',
                  <b>pattern: 'report_id',</b> // matching JSON: "type":"report_id" 
                  path : '/path/to/your.log'
                }
              ]
};
</pre>

--------------------


### Test
<pre>
nodejs statsstrmr.js -c ./myconfig.js
</pre>

### Configure
Copy your final application parameters for API and LOGS monitoring in ```config.js``` and run ```forever```
```
npm forever
```

### Example Output in HOMER 5
![](https://camo.githubusercontent.com/dd2234b69c44143ec5ca37ff60449761a2fe4aef/687474703a2f2f692e696d6775722e636f6d2f4941454455334d2e706e67)

Learn how to use this extension with real data on the [HOMER Wiki](https://github.com/sipcapture/homer/wiki/Example%3A-CustomStats)


---------

### Developers
Contributions to our projects are always welcome! If you intend to participate and help us improve our software, we kindly ask you to sign a [CLA (Contributor License Agreement)](http://cla.qxip.net) and coordinate at best with the existing team via the [homer-dev](http://groups.google.com/group/homer-dev) mailing list.


----------


##### If you use our projects in production, please consider supporting us with a [donation](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=donation%40sipcapture%2eorg&lc=US&item_name=SIPCAPTURE&no_note=0&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedGuest)

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=donation%40sipcapture%2eorg&lc=US&item_name=SIPCAPTURE&no_note=0&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedGuest)



