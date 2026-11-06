// CONEXÃO COM OS ELEMENTOS DO HTML

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const foto = document.querySelector("#foto");
const velocidade = document.querySelector("#velocidade");
const reiniciar = document.querySelector("#reiniciar");
const mensagemStatus = document.querySelector("#status");


// VARIÁVEIS DO PROJETO

let particulas = [];
let animacao = null;
let imagemAtual = null;


// MENSAGEM INICIAL

mensagemStatus.textContent = "JavaScript conectado! Escolha uma foto.";


// EVENTO PARA SELECIONAR UMA IMAGEM

foto.addEventListener("change", function () {

    const arquivo = foto.files[0];

    if (!arquivo) {
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function (evento) {

        const imagem = new Image();

        imagem.onload = function () {

            imagemAtual = imagem;

            criarParticulas(imagem);
        };

        imagem.src = evento.target.result;
    };

    leitor.readAsDataURL(arquivo);
});


// FUNÇÃO PARA TRANSFORMAR A IMAGEM EM PARTÍCULAS

function criarParticulas(imagem) {

    cancelAnimationFrame(animacao);

    particulas = [];

    const limite = 500;

    const proporcao = Math.min(
        limite / imagem.width,
        limite / imagem.height,
        1
    );

    canvas.width = Math.floor(imagem.width * proporcao);
    canvas.height = Math.floor(imagem.height * proporcao);

    ctx.drawImage(
        imagem,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const dados = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const pixels = dados.data;

    const tamanho = 5;

    for (let y = 0; y < canvas.height; y += tamanho) {

        for (let x = 0; x < canvas.width; x += tamanho) {

            const indice = (y * canvas.width + x) * 4;

            const vermelho = pixels[indice];
            const verde = pixels[indice + 1];
            const azul = pixels[indice + 2];
            const transparencia = pixels[indice + 3];

            if (transparencia > 50) {

                particulas.push({

                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,

                    destinoX: x,
                    destinoY: y,

                    cor: `rgba(${vermelho}, ${verde}, ${azul}, ${transparencia / 255})`,

                    tamanho: tamanho

                });
            }
        }
    }

    mensagemStatus.textContent = "Imagem transformada em partículas!";

    animar();
}


// FUNÇÃO DE ANIMAÇÃO

function animar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const rapidez = Number(velocidade.value);

    particulas.forEach(function (particula) {

        particula.x +=
            (particula.destinoX - particula.x) * rapidez;

        particula.y +=
            (particula.destinoY - particula.y) * rapidez;

        ctx.fillStyle = particula.cor;

        ctx.fillRect(
            particula.x,
            particula.y,
            particula.tamanho,
            particula.tamanho
        );

    });

    animacao = requestAnimationFrame(animar);
}


// EVENTO PARA REINICIAR A ANIMAÇÃO

reiniciar.addEventListener("click", function () {

    if (!imagemAtual) {

        mensagemStatus.textContent = "Escolha uma imagem primeiro.";

        return;
    }

    // Recria as partículas usando a imagem guardada
    criarParticulas(imagemAtual);

});