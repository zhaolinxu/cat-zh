var gDrive = (function() {
    return {
        //Add Google Drive Client ID Here...
        clientId: '465747959401-8iaddqqtj47hinpeh3iku1ohoun2r7u6.apps.googleusercontent.com',
        driveScope: 'https://www.googleapis.com/auth/drive.appfolder',
        checkAuth: function() {
            console.log(this.clientId);
            gapi.auth.authorize(
                {'client_id': this.clientId, 'scope': this.driveScope, 'immediate': true},
                handleAuthResult);
        },
        DEFAULT_FILE: {
            content: '',
            metadata: {
                id: null,
                title: 'kitten.txt',
                mimeType: 'text/plain',
                editable: true
            }
        }
    }
}());

function handleClientLoad() {
    //gDrive.checkAuth();

}

function insertFileInApplicationDataFolder(fileData, callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = function (e) {
        var contentType = fileData.type || 'application/octet-stream';
        var metadata = {
            'title': fileData.fileName,
            'mimeType': contentType,
            'parents': [{'id': 'appfolder'}]
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        });
        if (!callback) {
            callback = function (file) {
                console.log(file)
            };
        }
        request.execute(callback);
    }
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        // Access token has been successfully retrieved, requests can be sent to the API
        //alert('awesome!')
        gapi.client.load('drive', 'v2', function() {
            var request = gapi.client.drive.files.get({
                'fileId': 'appfolder'
            });
            request.execute(function (resp) {
                console.log('Id: ' + resp.id);
                console.log('Title: ' + resp.title);
            });

            //Try and load a file;

            //Try and save a file;
            //insertFileInApplicationDataFolder("hello word", function(err) {
                //console.log('saved', JSON.stringify(err))
            //})
        });

    } else {
        // No access token could be retrieved, force the authorization flow.
        console.log('no')
        gapi.auth.authorize(
            {'client_id': gDrive.clientId, 'scope': gDrive.driveScope, 'immediate': false},
            handleAuthResult);
    }
}


//function loadClient(callback) {
//    gapi.client.load('drive', 'v2', callback);
//}

//loadClient(handleClientLoad);