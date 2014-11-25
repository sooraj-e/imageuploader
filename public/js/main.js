$(document).ready(function() {
    status('Choose an Image.');

    $('#photo').change(function() {
        var readFile = new FileReader;

        readFile.onload = function() {
            var img = new Image;

            img.onload = function() {
                status('');

                try {
                    if (img.width < 1024 || img.height < 1024) {
                        status('Image Resolution Must Be Atleast 1024x1024. Current Resolution Is ' + img.width + 'x' + img.height);
                    } else {
                        $('#uploadForm').submit();
                    }
                } catch (e) {
                    status('Image Upload Failed. Resolution Must Be Atleast 1024x1024.');

                }
            };

            img.src = readFile.result;
        };

        readFile.readAsDataURL(this.files[0]);
    });



    $('#uploadForm').submit(function() {
        status('uploading the file ...');
        $("#images").empty();

        $(this).ajaxSubmit({

            error: function(xhr) {
                if (xhr.responseJSON && xhr.responseJSON.message)
                    status('Error: ' + xhr.responseJSON.message);
                else
                    status('Error: ' + xhr.status);
            },

            success: function(response) {
                console.log(response);
                status('Image Uploaded & Converted Successfully');

                $("#images").empty();
                if (response.images.horizontal)
                    $("#images").append('<li><a  target="_blank" href="' + response.images.horizontal + '"><span class="tab">Horizontal</span></a></li>');
                if (response.images.vertical)
                    $("#images").append('<li><a  target="_blank" href="' + response.images.vertical + '"><span class="tab">Vertical</span></a></li>');
                if (response.images.gallery)
                    $("#images").append('<li><a  target="_blank" href="' + response.images.gallery + '"><span class="tab">Gallery</span></a></li>');
                if (response.images.hsmall)
                    $("#images").append('<li><a  target="_blank" href="' + response.images.hsmall + '"><span class="tab">Horizontal Small</span></a></li>');

            }
        });

        // Have to stop the form from submitting and causing                                                                                                       
        // a page refresh - don't forget this                                                                                                                      
        return false;
    });

    function status(message) {
        $('#status').text(message);
    }
});