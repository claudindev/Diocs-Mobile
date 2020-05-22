var db = firebase.firestore();

let currentUser;

let userData;

firebase.auth().onAuthStateChanged(function(user) {
    currentUser = user;
    if (user) {
        getUser(user);
    } else {
        window.location.href = "login.html";
    }
});

function getUser(user) {
    db.collection("usuarios").doc(user.uid)
    .onSnapshot(function(doc) {
        console.log("Current data: ", doc.data());
        if (doc.data() == undefined) {
            db.collection("usuarios").doc(user.uid).set({
                pontos: 0,
                sorteio: false
            })
        } else {
            userData = doc.data();
            atualizarProgresso();
        }
    });
}

function aumentarPonto() {
    novoPontos = userData.pontos + 1;
    db.collection('usuarios').doc(currentUser.uid).set({
        pontos: novoPontos,
        sorteio: userData.sorteio
    });
    atualizarProgresso();
}

function diminuirPonto() {
    novoPontos = userData.pontos - 1;
    db.collection('usuarios').doc(currentUser.uid).set({
        pontos: novoPontos,
        sorteio: userData.sorteio
    });
    atualizarProgresso();
}

function entrarSorteio() {
    db.collection('usuarios').doc(currentUser.uid).set({
        pontos: userData.pontos,
        sorteio: true
    });
}

function sairSorteio() {
    db.collection('usuarios').doc(currentUser.uid).set({
        pontos: userData.pontos,
        sorteio: false
    });
}

function abrirRegulamento() {
    document.getElementsByClassName('regulamento-wrapper')[0].classList.remove('regulamento-hidden');
}

function fecharRegulamento() {
    document.getElementsByClassName('regulamento-wrapper')[0].classList.add('regulamento-hidden');
}

function atualizarProgresso(){
    let porcentagem = userData.pontos*25;
    if (porcentagem >= 100) {
        document.getElementsByClassName('sorteio-texto')[1].style.setProperty('display', 'none');
        document.getElementsByClassName('barra-progresso-fora')[0].style.setProperty('display', 'none');

        if (userData.sorteio == false) {
            document.getElementsByClassName('sorteio-texto')[0].innerHTML = `Parabéns! Você pode participar do sorteio:`;
            document.getElementsByClassName('btn-participar')[0].style.setProperty('display', 'block');
            document.getElementsByClassName('btn-deixar')[0].style.setProperty('display', 'none');
        } else {
            document.getElementsByClassName('sorteio-texto')[0].innerHTML = `Você está participando do sorteio!`;
            document.getElementsByClassName('btn-participar')[0].style.setProperty('display', 'none');
            document.getElementsByClassName('btn-deixar')[0].style.setProperty('display', 'block');
        }
    } else {
        document.getElementsByClassName('barra-progresso-dentro')[0].style.width = porcentagem+"%";   
        document.getElementsByClassName('sorteio-texto')[1].innerHTML = "Você tem "+ userData.pontos +"/4 pontos de busca";
    }
    
}