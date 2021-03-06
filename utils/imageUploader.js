'use strict';
const Promise = require('bluebird');
const streamToPromise = require('stream-to-promise');
const rp = require('request-promise');

const url = 'https://graph.facebook.com';

function apiInit(args, fileSize) {
	const options = {
		method: 'POST',
		uri: url + '/'+args.id+'/photos?access_token='+args.token,
		json: true,
		form: {
            upload_phase: 'start',
            title: args.title,
            description : args.description,
			file_size: fileSize
		}
	};

	return rp(options);
}

function apiFinish(args, id, photo_id) {
	const options = {
		method: 'POST',
		uri: url +'/'+args.id+'/photos',
		form: {
			access_token: args.token,
			upload_phase: 'finish',
			upload_session_id: id,
            title: args.title,
            description : args.description
		},
		json: true
	};

	return rp(options)
		.then(res => {
			res.photo_id = photo_id;
			return res;
		});
}

function uploadChunk(args, id, start, chunk) {
	const formData = {
		access_token: args.token,
		upload_phase: 'transfer',
		start_offset: start,
		upload_session_id: id,
		video_file_chunk: {
			value: chunk,
			options: {
				filename: 'chunk'
			}
		}
	};
	const options = {
		method: 'POST',
		uri: url +'/'+args.id+'/photos',
		formData: formData,
		json: true
	};

	return rp(options);
}

function uploadChain(buffer, args, res, ids) {
	if (res.start_offset === res.end_offset) {
		return ids;
	}
	var chunk = buffer.slice(res.start_offset, res.end_offset);
	return uploadChunk(args, ids[0], res.start_offset, chunk)
	.then(res => uploadChain(buffer, args, res, ids));
}

function facebookApiPhotoUpload(args) {
	return Promise.resolve(streamToPromise(args.stream))
		.then(buffer => buffer)
		.then(buffer => [buffer, apiInit(args, buffer.length)])
		.spread((buffer, res) => {
			const ids = [res.upload_session_id, res.photo_id];
			return uploadChain(buffer, args, res, ids);
		})
		.spread((id, photo_id) => apiFinish(args, id, photo_id));
}

var ImageUploader = function () {
    var args = null;
    return this.prototype
}//var ImageUploader = function (args) {
ImageUploader.prototype.UploadImage - function (args) {
    return facebookApiPhotoUpload(args);
}

module.exports = ImageUploader;