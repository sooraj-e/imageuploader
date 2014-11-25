var path = require('path'),
    secrets = require('../config/secrets'),
    papercut = require('papercut');

/**
 * GET /
 * Upload page.
 */
exports.index = function(req, res) {
    res.render('index', {
        title: 'ImageUploader'
    });
};
/**
 * POST /upload
 * Upload.
 */
exports.upload = function(req, res) {

    if (!req.files || !req.files.photo || !req.files.photo.path) {
        req.flash('errors', {
            msg: 'Image Missing'
        });
        return res.redirect('/');

    }
    //checking for s3 upload
    if (req.body.type) {
        papercut.configure(function() {
            papercut.set('storage', 's3')
            papercut.set('S3_KEY', secrets.s3.S3_KEY)
            papercut.set('S3_SECRET', secrets.s3.S3_SECRET)
            papercut.set('bucket', secrets.s3.BUCKET)
        });
    } else {
        papercut.configure(function() {
            papercut.set('storage', 'file')
            papercut.set('directory', path.join(__dirname, '../uploads'))
            papercut.set('url', '/uploads')
        });
    }
    //image variants
    InsiderUploader = papercut.Schema(function(schema) {
        schema.version({
            name: 'horizontal',
            size: '755x450',
            process: 'crop'
        });
        schema.version({
            name: 'vertical',
            size: '365x450',
            process: 'crop'
        });
        schema.version({
            name: 'gallery',
            size: '380x380',
            process: 'crop'
        });
        schema.version({
            name: 'hsmall',
            size: '356x212',
            process: 'crop'
        });
    });
    uploader = new InsiderUploader();
    uploader.process(req.files.photo.name, req.files.photo.path, function(err, images) {
        if (err || !images) {
            console.log(err);
            res.status(406).json({
                message: 'Image Upload Failed.'
            })
        } else {
            console.log(images);
            //fix old s3 url
            if (req.body.type) {
                images.hsmall = images.hsmall.replace('https://s3.amazonaws.com/instalively/', 'https://instalively.s3.amazonaws.com/');
                images.gallery = images.gallery.replace('https://s3.amazonaws.com/instalively/', 'https://instalively.s3.amazonaws.com/');
                images.vertical = images.vertical.replace('https://s3.amazonaws.com/instalively/', 'https://instalively.s3.amazonaws.com/');
                images.horizontal = images.horizontal.replace('https://s3.amazonaws.com/instalively/', 'https://instalively.s3.amazonaws.com/');

            }
            res.status(200).json({
                message: 'Image Upload Success.',
                images: images
            })
        }
    })

}