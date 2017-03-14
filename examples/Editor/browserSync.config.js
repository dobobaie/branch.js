var os = require('os');

var browser   =
  (os.platform() == 'linux') ?
  ('google-chrome') :
  ((os.platform() == 'darwin') ?
  ('google chrome') :
  ((os.platform() == 'win32') ?
  ('firefox') : ('chrome')))
;

module.exports = {
  //port: 3001,
  server: {
    baseDir: 'src/',
  },
  browser: browser,
};
