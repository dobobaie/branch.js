/**

**/
var modal = (function()
{
	let _engine = {
		this: this,
		modalOpen: false,
	};

	this.open = function(url, callback) {
		if (_engine.modalOpen == true) {
			return _engine.this;
		}
		$('body').append('<div id="modal"></div>').after(function() {
			$('#modal').load(url, function(response, status) {
				if (status == 'error') {
					_engine.this.close();
					return _engine.this;
				}
				$('#modal').children().modal({
					dismissible: true,
					ready: callback,
					complete: _engine.this.close,
				}).modal('open');
				_engine.modalOpen = true;
			});
		});
		return _engine.this;
	}

	this.close = function() {
		if ($('#modal') == null || typeof($('#modal')) == 'undefined' || $('#modal').length == 0) {
			return _engine.this;
		}
		if ($('#modal').children().length > 0) {
			$('#modal').children().modal('close');
			_engine.modalOpen = false;
		}
		$('#modal').remove();
		return _engine.this;
	}

	return _engine.this;
})();

/**

**/
var toResizeImage = function(data, maxSize, callback)
{
	let reader = new FileReader();
	reader.onload = function(readerEvt) {
		let binaryString = readerEvt.target.result;
		let canvas = document.createElement('canvas');
		
		let ratio = (canvas.width > canvas.height ? canvas.width / maxSize : canvas.height / maxSize);
		ratio = (canvas.width <= maxSize && canvas.height <= maxSize ? 1 : ratio);
		let width = canvas.height, height = canvas.width;
		canvas.width = width / ratio;
		canvas.height = height / ratio;
		
		let ctx = canvas.getContext('2d');
		let image = new Image();
		image.onload = function() {
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

			let base64 = canvas.toDataURL();
			let arr = base64.split(',');
			let bstr = atob(arr[1]);
			let len = bstr.length;
			let u8arr = new Uint8Array(len);
			while (len--) {
				u8arr[len] = bstr.charCodeAt(len);
			}
			let mime = arr[0].match(/:(.*?);/)[1];
			let file = new File([u8arr], data.name, {type: mime});

			callback(file);
		};
		image.src = 'data:'+data.type+';base64,'+btoa(binaryString);
	};
	reader.readAsBinaryString(data);
};