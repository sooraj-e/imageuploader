imageuploader
=============

Simple Image upload and conversion in Node.js

* Image Upload

* Restrict images with resolution less than 1024x1024.

* Each image converted into 4 different sizes. 

  * horizontal : 755 x 450

  * vertical : 365 x 450

  * horizontal small : 365 x 212

  * gallery : 380 x 380

* Save to server or S3

##Dependencies
Requires imagemagick CLI tools to be installed. 
OS X

`brew install imagemagick`

Linux

`sudo apt-get install libmagick++-dev`
or
`sudo yum install ImageMagick-c++ ImageMagick-c++-devel`

##How to run.
* Install node modules `sudo npm install`
* Rename config/secrets.sample.js to config/secrets.js 
* For S3 upload set your S3 api key, secret and bucket name in secrets.js
* Run node app.js
