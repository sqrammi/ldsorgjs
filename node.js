/*jshint -W054 */
;(function (exports) {
  'use strict';

  var LdsOrgNode = { init: function (LdsDir, ldsDirP) {

    var request = require('request')
      ;

    ldsDirP._signin = function (cb, auth) {
      var me = this
        ;

      me.__jar = request.jar();
      request.post('https://signin.lds.org/login.html', {
        jar: me.__jar
      , form: {
          username: auth.username
        , password: auth.password
        }
      }, function (err, res, body) {
        if (err) {
          cb(err);
          return;
        }

        if (/SSO/.test(body)) {
          cb(new Error('Failed to authenticate. Check username / password'));
          return;
        }

        cb(null);
      });
    };

    ldsDirP._makeRequest = function (cb, url) {
      var me = this
        ;

      request.get(url, {
        jar: me.__jar
      }, function (err, res, body) {
        var data
          ;

        if (err) {
          cb(err);
          return;
        }

        try {
          data = JSON.parse(body);
        } catch(e) {
          console.error(e);
          console.log(typeof body, JSON.stringify(body));
          console.log(url);
        }

        cb(null, data);
      });
    };

    ldsDirP._getImageData = function (next, imgSrc) {
      var me = this
        ;

      if (!imgSrc) {
        next(new Error('no imgSrc'));
        return;
      }

      // encoding is utf8 by default
      request.get(imgSrc, { jar: me.__jar, encoding: null }, function (err, res, body) {
        next(err, body && ('data:image/jpeg;base64,' + body.toString('base64')) || "");
      });
    };
  }};

  module.exports = exports = LdsOrgNode.LdsOrgNode = LdsOrgNode;
}('undefined' !== typeof exports && exports || new Function('return this')()));
