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
    gDrive.checkAuth();

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