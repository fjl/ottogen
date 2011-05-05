var url = require('url');
var connect = require('connect');
var Canvas  = require('canvas');

var Otto = {
  fontWeight: 'bold',
  fontFamily: 'Dax',
  ratio: 0.918,
  s_colors:  ['rgb(228,87,16)',   'rgb(83,11,23)',  'rgb(245,158,0)'],
  t_colors:  ['rgb(255,255,255)', 'rgb(228,87,16)', 'rgb(83,11,23)'],
  stripes:   [0.422,              0.274,            0.308],

  draw: function (size, text) {
    var canvas = new Canvas(size * Otto.ratio, size),
        ctx = canvas.getContext('2d'),
        y = 0;

    for (var i = 0; i < Otto.stripes.length; i++) {
      var h = Otto.stripes[i] * canvas.height;
      ctx.fillStyle = Otto.s_colors[i];
      ctx.fillRect(0, y, canvas.width, h);

      var fontSize = h - (h/8);
      ctx.font = Otto.fontWeight + ' ' + fontSize + 'px ' + Otto.fontFamily;
      var m = ctx.measureText(text[i]);
      var optimal = canvas.width - (canvas.width / 8);
      while (m.width > optimal) {
        fontSize--;
        ctx.font = Otto.fontWeight + ' ' + fontSize + 'px ' + Otto.fontFamily;
        m = ctx.measureText(text[i]);
      }

      ctx.fillStyle = Otto.t_colors[i];
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(text[i], canvas.width/2.05, y + (h * 0.4));

      y += h;
    }

    return canvas;
  },

  handle: function (req, resp) {
    var query = url.parse(req.url, true).query;
    var text  = [query.t1 || '', query.t2 || '', query.t3 || '']
    text = text.map(function (s) { return s.replace(/^\s*([\S\s]*?)\s*$/, '$1') });
    var size  = parseInt(query.size);
    var canv  = Otto.draw((isNaN(size) ? 300 : size), text);
    var stream = canv.createPNGStream();

    resp.writeHeader(200, {'Content-Type': 'image/png'});
    stream.on('data', function (chunk) { resp.write(chunk); });
    stream.on('end',  function (chunk) { resp.end(chunk);  });
  }
};

var srv  = connect.createServer();

srv.use(connect.responseTime());
srv.use(connect.logger());
srv.use('/otto', Otto);
srv.use('/',     connect.static(__dirname + '/static'));
srv.listen(8000);
