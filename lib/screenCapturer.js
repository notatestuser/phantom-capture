/*
    Phantom Capture 1.x
    Argument parser
 */

'use strict';

/* global console, require, module, phantom: true */

var nameSanitizer = require('./nameSanitizer');

function saveScreenshotDevice(url, host, device, saveLocation, callback) {
    var page = require('webpage').create();
    page.viewportSize = {
        width: device.width,
        height: device.height
    };

    if (device.userAgent) {
        page.settings.userAgent = device.userAgent;
    }

    page.open(url, function(status) {
        if (status === 'success') {
            var filename = saveLocation + '/' + nameSanitizer.getSanitizedName(host) + '-' +
                nameSanitizer.getSanitizedName(device.name) + '.png';
            console.log('Capturing', url, 'on', device.name, '(' + device.width + 'x' + device.height + ')');
            page.render(filename);
            console.log('Saved', filename);
        } else {
            console.log('Unable to load', url, ' on ', device.name);
        }
        page.close();
        callback.apply();
    });
}

module.exports = {
    saveScreenshots: function(url, host, devices, saveLocation) {
        function saveScreenshot() {
            var device = devices.pop();

            if (device) {
                saveScreenshotDevice(url, host, device, saveLocation, saveScreenshot);
            } else {
                phantom.exit();
            }
        }
        saveScreenshot();
    }
};