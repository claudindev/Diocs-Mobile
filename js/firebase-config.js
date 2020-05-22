// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDL4vO5O4u-cPb90s1vpUsHcmNg3pzjhrk",
    authDomain: "diocs-277608.firebaseapp.com",
    databaseURL: "https://diocs-277608.firebaseio.com",
    projectId: "diocs-277608",
    storageBucket: "diocs-277608.appspot.com",
    messagingSenderId: "460734460477",
    appId: "1:460734460477:web:5f7747226a8312d9c1b054",
    measurementId: "G-QZEK7CGHT7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function criarConta(tipo) {
    switch (tipo) {
        case 'email':
            let email = document.getElementById('email').value;

            let password = document.getElementById('senha').value;

            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                alert('Houve um problema, verifique se as informações foram preenchidas corretamente.');
            });
            break;
    }
}

let provider;

function entrar(tipo) {
    switch (tipo) {
        case 'email':
            let email = document.getElementById('email').value;

            let password = document.getElementById('senha').value;

            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                alert('Houve um problema, verifique se as informações foram preenchidas corretamente.');
            });
            break;

        case 'google':
            provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...
              }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode + errorMessage);
            });
            break;

        case 'twitter':
            break;
            
        case 'facebook':
            provider = new firebase.auth.FacebookAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode + errorMessage);
            });
            break;
    }
}
