var cnv = document.querySelector('canvas');
var ctx = cnv.getContext('2d');
//GLOBAIS VARIAVEIS.
var sprites = new Array();

var GLOBAIS = {
    vida: 3,
    pontos: 0,
	fase: 0,
	teia: null,
	teiaY: 0,
	teiaX: 0,
	lancaTeia: false,
	teiaCarga: 50,
	teiaXfim: null,
	teiaYfim: null,
	colide: null,//com oque a ponta da teia esta colidindo...
	dist: 0, //distancia do balançar
	ajustar: false,
	paredeLar:30,//espacoVazio dos blocos que compoem as paredes do predio
	paredeAlt: 35,//altura dos blocos que compoem as paredes do predio
	predioBlocos: 10, //aceita somente numeros pares de blocos...
	predioDiferencaespacoVazio: 2,
	predioDivide: 7,//a cada x andares diminui o predio
	caindo: false,
	pause: false
}
const janela = [1, 130, 66, 98, 259];//srcX
const jnl = 2;//maximo 5 janelas diferentes... repensar

var andares;
var BUFFER = {//BUFFER para reduzir for's no codigo...
	indexTeia: encontrar('teia'),
	indexPlayer: encontrar('player')
}

startFase(GLOBAIS.fase);
loop();
//************************************************************************************************ */
function loop(){
	BUFFER = {//BUFFER para reduzir for's no codigo...
		indexTeia: encontrar('teia'),
		indexPlayer: encontrar('player')
	}
    // limpar tela
	ctx.clearRect(0,0,cnv.width,cnv.height);
	for (let i = 0 ; i < sprites.length; i++) {//percorre array de sprites for principal...
		if (!GLOBAIS.pause) {/////////////
			sprites[i].exe();/////////////////  movimento do jogo...            
		}////////////////////////////////////
		(sprites[i].flag == 'player') ? teia() : null;//chama função que desenha teia antes desenhar aranha
		(sprites[i].flag != 'teia' && sprites[i].flag != 'vilao' && colide(sprites[i], sprites[BUFFER.indexTeia])) ? GLOBAIS.colide = sprites[i].flag : null;//com oque a ponta da teia colidiu por ultimo... problema quando ponta da teia termina em vazio Globais.colide mantem o ultimo sprite a colidir com a ponta da teia como parametro precisa identificar que ponta da teia esta no vazio???
		sprites[i].render();/////////////// renderiza na tela...
		//
		if (GLOBAIS.ajustar) {
			GLOBAIS.ajustar = false;
			if (sprites[BUFFER.indexPlayer].meiox() > cnv.width/2) {
				GLOBAIS.ajustar = true;
				(sprites[i].flag != 'placar') ? sprites[i].posX-- : null;
			}
			if (sprites[BUFFER.indexPlayer].meiox() < cnv.width/2) {
				GLOBAIS.ajustar = true;
				(sprites[i].flag != 'placar') ? sprites[i].posX++ : null;
			}
			if (sprites[BUFFER.indexPlayer].meioy() > cnv.height/2 + GLOBAIS.paredeLar) {
				//GLOBAIS.ajustar = true;
				//sprites[i].posY--;
			}
			if (sprites[BUFFER.indexPlayer].meioy() < cnv.height/2 + GLOBAIS.paredeLar) {
				GLOBAIS.ajustar = true;
				(sprites[i].flag != 'placar') ? sprites[i].posY++ : null;
			}
		}
		if(GLOBAIS.caindo){			
			if(abaixoDaTela()){
				(sprites[i].flag != 'player' && sprites[i].flag != 'teia' && sprites[i].flag != 'placar') ? sprites[i].posY-=2 : null;
			}else{
				if(sprites[BUFFER.indexPlayer].posY < cnv.height - sprites[BUFFER.indexPlayer].alt) {
					sprites[BUFFER.indexPlayer].movDown = true;
				}else{
					sprites[BUFFER.indexPlayer].movDown = false;
					//homem aranha morre, se esburracha no chão
					sprites[BUFFER.indexPlayer].srcX = 247;
					sprites[BUFFER.indexPlayer].srcY = 280-14;
					sprites[BUFFER.indexPlayer].lar = 40;
					//sprites[BUFFER.indexPlayer].alt = 10;
					//console.log('perdeu vida...');
				}
			}
		}
		if (sprites[i].flag == 'fimDaFase' && colide(sprites[i], sprites[BUFFER.indexPlayer])) {
			//alert('fimDaFase');
		}
		//exclui do array
		if (sprites[i].flag == 'excluir' || sprites[i].flag == 'delete') {
			sprites.splice(i, 1);
		}
	}
	//placar
    ctx.font = "15px Arial";//  TEXTO...
	ctx.fillStyle = 'red';
    ctx.fillText(GLOBAIS.pontos, 13,  cnv.height - 15);	
	ctx.font = "10px Arial";//  TEXTO...
	ctx.fillStyle = 'white';
	ctx.fillText(GLOBAIS.teiaCarga+' m', 17,  cnv.height - 5);

	//teia off...
	if (GLOBAIS.colide == 'player' && sprites[BUFFER.indexTeia].lar == 15) {
		sprites[BUFFER.indexTeia].srcX = 5;
		sprites[BUFFER.indexTeia].srcY = 5;
		sprites[BUFFER.indexTeia].lar = 5;
		sprites[BUFFER.indexTeia].alt = 5;
		GLOBAIS.teiaY = 0;
		GLOBAIS.teiaX = 0;
		sprites[BUFFER.indexPlayer].movRight = false;
		sprites[BUFFER.indexPlayer].movLeft = false;
		//136, 208, 23, 36, sprite inicial 
		sprites[BUFFER.indexPlayer].srcX = 136;
		sprites[BUFFER.indexPlayer].srcY = 208;
		sprites[BUFFER.indexPlayer].lar = 23;
		sprites[BUFFER.indexPlayer].alt = 36;
		sprites[BUFFER.indexPlayer].movUp = false;
		GLOBAIS.ajustar = true;
	}
	//caindo
	if (GLOBAIS.caindo) {
		sprites[BUFFER.indexTeia].srcX = 5;
		sprites[BUFFER.indexTeia].srcY = 5;
		sprites[BUFFER.indexTeia].lar = 5;
		sprites[BUFFER.indexTeia].alt = 5;
		//GLOBAIS.teiaY = 0;
		//GLOBAIS.teiaX = 0;
		sprites[BUFFER.indexPlayer].movRight = false;
		sprites[BUFFER.indexPlayer].movLeft = false;
		//
		sprites[BUFFER.indexPlayer].srcX = 47;
		sprites[BUFFER.indexPlayer].srcY = 262;
		sprites[BUFFER.indexPlayer].lar = 31;
		sprites[BUFFER.indexPlayer].alt = 27;
	}

	requestAnimationFrame(loop, "canvas");
}
/*****************************************************************************************************/
function abaixoDaTela() {
	let resp = false;
	sprites.forEach(spr => {
		(spr.posY > cnv.height - spr.alt && spr.flag != 'player' && spr.flag != 'teia') ? resp = true : null;
	});
	return resp;
}
function teia() {
	//lança teia...
	if (GLOBAIS.teia && GLOBAIS.lancaTeia && GLOBAIS.teiaCarga) { //console.log('lançar teia');
		GLOBAIS.ajustar = false;
		//teia sobe
		let limteia = -75;
		(GLOBAIS.teiaY > limteia) ? GLOBAIS.teiaY-=2 : null;
		(GLOBAIS.teiaY > limteia) ? GLOBAIS.teiaCarga-=1 : null;
		switch (GLOBAIS.teia) {					
			case 'right':
					//direita -->
					(GLOBAIS.teiaY > limteia) ? GLOBAIS.teiaX+= 1.5 : null;
					sprites[BUFFER.indexPlayer].srcX = 356;
					sprites[BUFFER.indexPlayer].srcY = 163;
					sprites[BUFFER.indexPlayer].lar = 24;
					sprites[BUFFER.indexPlayer].alt = 27;
				break;

			case 'left':
					//esquerda <--
					(GLOBAIS.teiaY > limteia) ? GLOBAIS.teiaX-= 1.5 : null;
					sprites[BUFFER.indexPlayer].srcX = 380;
					sprites[BUFFER.indexPlayer].srcY = 163;
					sprites[BUFFER.indexPlayer].lar = 24;
					sprites[BUFFER.indexPlayer].alt = 27;
				break;
		
			default:
				console.log('GLOBAIS.teia --> '+GLOBAIS.teia);
				break;
		}
	}
	// Define a new Path: desenha teia...
	ctx.beginPath();
	// ponta da teia
	if(sprites[BUFFER.indexTeia].lar < 10){//movimenta ponta da teia...
		GLOBAIS.teiaXfim = sprites[BUFFER.indexPlayer].meiox() + GLOBAIS.teiaX;
		GLOBAIS.teiaYfim = sprites[BUFFER.indexPlayer].meioy() + GLOBAIS.teiaY;
	}
	sprites[BUFFER.indexTeia].posX = GLOBAIS.teiaXfim - sprites[BUFFER.indexTeia].metax();
	sprites[BUFFER.indexTeia].posY = GLOBAIS.teiaYfim - sprites[BUFFER.indexTeia].metay();	//
	ctx.moveTo(GLOBAIS.teiaXfim, GLOBAIS.teiaYfim);
	// Define an end Point ponta da teia que toca no player
	ctx.lineTo(sprites[BUFFER.indexPlayer].meiox(), sprites[BUFFER.indexPlayer].meioy()-sprites[BUFFER.indexPlayer].metay() / 2);
	// Stroke it (Do the Drawing)
	ctx.strokeStyle = "white";//cor da teia
	ctx.stroke();
	//pendurado na teia???
	if (sprites[BUFFER.indexTeia].lar == 15) {//ponta da teia aberta grudado a parede...
		GLOBAIS.caindo = false;
		sprites[BUFFER.indexPlayer].movDown = false;
		//console.log('pendurado na teia');
		//teia reta sem balanço
		if(sprites[BUFFER.indexPlayer].meiox() == sprites[BUFFER.indexTeia].meiox()){
			//console.log('sem balanço aranha--> '+ sprites[BUFFER.indexPlayer].meiox() );
		}else{//tem balanço
			console.log('com balanço dist--> '+ GLOBAIS.dist );
			if(GLOBAIS.dist > 0){//teia para direita
				sprites[BUFFER.indexPlayer].movLeft = false;
				(sprites[BUFFER.indexPlayer].meiox() - sprites[BUFFER.indexTeia].meiox() >= GLOBAIS.dist ) ? GLOBAIS.dist *= -1 : sprites[BUFFER.indexPlayer].movRight = true;
				//
				if(sprites[BUFFER.indexPlayer].meiox() - sprites[BUFFER.indexTeia].meiox() < 0) {
					sprites[BUFFER.indexPlayer].posY += .5;
				}
				if(sprites[BUFFER.indexPlayer].meiox() - sprites[BUFFER.indexTeia].meiox() > 0) {
					sprites[BUFFER.indexPlayer].posY -= .5;
				}
				if (sprites[BUFFER.indexTeia].meiox() - sprites[BUFFER.indexPlayer].meiox() > 0) {
					sprites[BUFFER.indexPlayer].srcX = 145;
					sprites[BUFFER.indexPlayer].srcY = 114;
					sprites[BUFFER.indexPlayer].lar = 24;
					sprites[BUFFER.indexPlayer].alt = 27;
				}else{
					sprites[BUFFER.indexPlayer].srcX = 178;
					sprites[BUFFER.indexPlayer].srcY = 117;
					sprites[BUFFER.indexPlayer].lar = 29;
					sprites[BUFFER.indexPlayer].alt = 25;
				}
				
			}else{
				//teia para esquerda
				sprites[BUFFER.indexPlayer].movRight = false;
				(sprites[BUFFER.indexPlayer].meiox() - sprites[BUFFER.indexTeia].meiox() <= GLOBAIS.dist ) ? GLOBAIS.dist *= -1 : sprites[BUFFER.indexPlayer].movLeft = true;
				if(sprites[BUFFER.indexPlayer].meiox() - sprites[BUFFER.indexTeia].meiox() > 0) {
					
					sprites[BUFFER.indexPlayer].posY += .5;
				}
				if(sprites[BUFFER.indexPlayer].meiox() - sprites[BUFFER.indexTeia].meiox() < 0) {
					
					sprites[BUFFER.indexPlayer].posY -= .5;
				}
				if (sprites[BUFFER.indexPlayer].meiox() - sprites[BUFFER.indexTeia].meiox() > 0) {
					sprites[BUFFER.indexPlayer].srcX = 159;
					sprites[BUFFER.indexPlayer].srcY = 139;
					sprites[BUFFER.indexPlayer].lar = 24;
					sprites[BUFFER.indexPlayer].alt = 27;
				}else{
					sprites[BUFFER.indexPlayer].srcX = 214;
					sprites[BUFFER.indexPlayer].srcY = 117;
					sprites[BUFFER.indexPlayer].lar = 29;
					sprites[BUFFER.indexPlayer].alt = 25;
				}
				
			}
		}
	}	
}
function pontaTeia() {//retorna oq esta tocando na ponta da teia no momento
	for (let i = 0; i < sprites.length; i++) {
		const spr = sprites[i];
		if (spr.flag != 'teia') {
			if (colide(spr, sprites[BUFFER.indexTeia])) {
				return spr.flag;
			}
		}
	}
	return false;
}
function predio(andar) {
	let ajt = 1;
	let ajuste = (10 - GLOBAIS.predioBlocos) / 2 * GLOBAIS.paredeLar;//centralizar predio na tela inicio game
	for (let i = 0; i < andar; i++) {		
		janela[Math.floor(Math.random() * jnl)];
		//predio
		if(i / GLOBAIS.predioDivide == ajt) {//diminui espacoVazio do predio...
			(ajt < GLOBAIS.predioDivide) ? ajt++ : null;
			GLOBAIS.paredeLar -= GLOBAIS.predioDiferencaespacoVazio ;
			ajuste += GLOBAIS.predioDiferencaespacoVazio  * GLOBAIS.predioBlocos/2;
		}
		for (let j = 0; j < GLOBAIS.predioBlocos; j++) {// parede 832 768 960 705 640
			sprites.push(new Sprite('images/background.png', 'parede', 640, 99, GLOBAIS.paredeLar, GLOBAIS.paredeAlt, GLOBAIS.paredeLar*j + ajuste, cnv.height-GLOBAIS.paredeAlt - GLOBAIS.paredeAlt*i));
		}
		for (let j = 0; j < GLOBAIS.predioBlocos/2; j++) {//janela
			(i==0)?sprites.push(new Sprite('images/background.png', 'porta', 130, 909, 30, 35, GLOBAIS.paredeLar * GLOBAIS.predioBlocos /2 -GLOBAIS.paredeLar/2 + ajuste, cnv.height-GLOBAIS.paredeAlt - GLOBAIS.paredeAlt*i)) : sprites.push(new Sprite('images/background.png', 'janela', janela[Math.floor(Math.random() * jnl)], 909, 30, 23, GLOBAIS.paredeLar/2 + GLOBAIS.paredeLar*2*j + ajuste, cnv.height-GLOBAIS.paredeAlt - GLOBAIS.paredeAlt*i));			
		}		
	}
}
function construcao(menos = 0, niveis=1) {
	let blocoCentralAlt = 18;
	let barraFerroLarg = 10;
	let altura = 0;
	for (let k = 0; k < niveis; k++) {
		if (k) {
			GLOBAIS.paredeLar -= menos;
		}
		altura = cnv.height - GLOBAIS.paredeAlt*andares - GLOBAIS.paredeAlt*2 - blocoCentralAlt - (GLOBAIS.paredeAlt*3 - blocoCentralAlt + barraFerroLarg)*k;
		let inicial = cnv.width / 2 - GLOBAIS.paredeLar * GLOBAIS.predioBlocos / 2;//
		
		let espacoVazio = (GLOBAIS.paredeLar * GLOBAIS.predioBlocos - barraFerroLarg*2) / 4;
		let blocoCentralLar = 20;
		
		
		sprites.push(new Sprite('images/background.png', 'ferro', 899, 160, barraFerroLarg, GLOBAIS.paredeAlt*2+blocoCentralAlt, inicial, altura));//barra de ferro esquerda
		sprites.push(new Sprite('images/background.png', 'ferro', 899, 160, barraFerroLarg, GLOBAIS.paredeAlt*2 + blocoCentralAlt, inicial + GLOBAIS.paredeLar * GLOBAIS.predioBlocos - 10 , altura));//barra de ferro direita
		//central

		sprites.push(new Sprite('images/background.png', 'ferro', 899, 160, blocoCentralLar, blocoCentralAlt, inicial + espacoVazio, cnv.height - GLOBAIS.paredeAlt*andares - GLOBAIS.paredeAlt - blocoCentralAlt - (GLOBAIS.paredeAlt*3 - blocoCentralAlt + barraFerroLarg)*k));

		sprites.push(new Sprite('images/background.png', 'ferro', 899, 160, blocoCentralLar, blocoCentralAlt, inicial + espacoVazio*3, cnv.height - GLOBAIS.paredeAlt*andares - GLOBAIS.paredeAlt - blocoCentralAlt - (GLOBAIS.paredeAlt*3 - blocoCentralAlt + barraFerroLarg)*k));
		let memo = inicial + espacoVazio*3 - (inicial + espacoVazio);
		//diagonais
		let diagonalLar = (espacoVazio - blocoCentralLar/2)/6;//calcular
		let diagonalAlt = 6;
		for (let i = 0; i < 6; i++) {		
			
			sprites.push(new Sprite('images/background.png', 'caboFerro', 899, 160, diagonalLar, diagonalAlt, inicial + barraFerroLarg + diagonalLar*i, altura + diagonalAlt*i));//-->baixo

			sprites.push(new Sprite('images/background.png', 'caboFerro', 899, 160, diagonalLar, diagonalAlt, inicial + espacoVazio + blocoCentralLar/2 +  barraFerroLarg + diagonalLar*i, cnv.height - GLOBAIS.paredeAlt*andares - GLOBAIS.paredeAlt + diagonalAlt*i-1 - (GLOBAIS.paredeAlt*3 - blocoCentralAlt + barraFerroLarg)*k));//-->baixo

			sprites.push(new Sprite('images/background.png', 'caboFerro', 899, 160, diagonalLar, diagonalAlt, inicial + barraFerroLarg + diagonalLar*i, cnv.height - GLOBAIS.paredeAlt*andares - diagonalAlt*i -diagonalAlt - (GLOBAIS.paredeAlt*3 - blocoCentralAlt + barraFerroLarg)*k));//-->cima

			sprites.push(new Sprite('images/background.png', 'caboFerro', 899, 160, diagonalLar, diagonalAlt, inicial + espacoVazio + blocoCentralLar/2 +  barraFerroLarg + diagonalLar*i, cnv.height - GLOBAIS.paredeAlt*andares - diagonalAlt*i -diagonalAlt - GLOBAIS.paredeAlt - blocoCentralAlt - (GLOBAIS.paredeAlt*3 - blocoCentralAlt + barraFerroLarg)*k+1));//-->cima
			/*************************/
			sprites.push(new Sprite('images/background.png', 'caboFerro', 899, 160, diagonalLar, diagonalAlt, inicial + memo + barraFerroLarg + diagonalLar*i, altura + diagonalAlt*i));//-->baixo

			sprites.push(new Sprite('images/background.png', 'caboFerro', 899, 160, diagonalLar, diagonalAlt, inicial + memo + espacoVazio + blocoCentralLar/2 +  barraFerroLarg + diagonalLar*i, cnv.height - GLOBAIS.paredeAlt*andares - GLOBAIS.paredeAlt + diagonalAlt*i - (GLOBAIS.paredeAlt*3 - blocoCentralAlt + barraFerroLarg)*k));//-->baixo

			sprites.push(new Sprite('images/background.png', 'caboFerro', 899, 160, diagonalLar, diagonalAlt, inicial + memo + barraFerroLarg + diagonalLar*i, cnv.height - GLOBAIS.paredeAlt*andares - diagonalAlt*i -diagonalAlt - (GLOBAIS.paredeAlt*3 - blocoCentralAlt + barraFerroLarg)*k));//-->cima
			//inicial + espacoVazio + blocoCentralLar/2 +  barraFerroLarg + diagonalLar*i
			sprites.push(new Sprite('images/background.png', 'caboFerro', 899, 160, diagonalLar, diagonalAlt, inicial + memo + espacoVazio + blocoCentralLar/2 +  barraFerroLarg + diagonalLar*i, cnv.height - GLOBAIS.paredeAlt*andares - diagonalAlt*i -diagonalAlt - GLOBAIS.paredeAlt - blocoCentralAlt - (GLOBAIS.paredeAlt*3 - blocoCentralAlt + barraFerroLarg)*k+1));//-->cima

		}
		for (let i = 0; i < 4; i++) {
			(i && k) ? recuo = barraFerroLarg/2*i*k : recuo=0;
			sprites.push(new Sprite('images/background.png', 'ferro', 899, 160, GLOBAIS.paredeLar*GLOBAIS.predioBlocos/4, barraFerroLarg, inicial + GLOBAIS.paredeLar*GLOBAIS.predioBlocos/4*i, altura - barraFerroLarg));
		}		
	}
	//final da fase player vence...
	let finalAlt = 30;
	let finalLar = 31;
	sprites.push(new Sprite('images/background.png', 'ferro', 224, 0, finalLar, finalAlt, cnv.width/2 -finalLar, altura - barraFerroLarg - finalAlt));
	sprites.push(new Sprite('images/background.png', 'ferro', 224, 0, finalLar, finalAlt, cnv.width/2 -finalLar, altura - barraFerroLarg - finalAlt*2));
	//
	sprites.push(new Sprite('images/background.png', 'ferro', 224, 0, finalLar, finalAlt, cnv.width/2, altura - barraFerroLarg - finalAlt));
	sprites.push(new Sprite('images/background.png', 'ferro', 224, 0, finalLar, finalAlt, cnv.width/2, altura - barraFerroLarg - finalAlt*2));

	sprites.push(new Sprite('images/background.png', 'fimDaFase', 320, 0, finalLar/2, finalAlt/2, cnv.width/2-finalLar/4, altura - barraFerroLarg - finalAlt - finalAlt/4));
	GLOBAIS.teiaCarga = altura*-1 + cnv.height;//???
}
function viloes(proporcao) {
	//limpar vilões do array
	for (let i = 0; i < sprites.length; i++) {
		const spr = sprites[i];
		(spr.flag == 'vilao' || spr.flag == 'golpe') ? spr.flag = 'excluir' : null;
	}
	//rastrear janelas
	let totalJanelas = contar('janela');
	let sortJanela = [];
	let iSort = Math.floor(Math.random() * totalJanelas);
	for (let i = 0; i < totalJanelas*proporcao; i++) {
		iSort = Math.floor(Math.random() * totalJanelas);//como garantir que ñ sorteie uma janela já ocupada
		while(sortJanela.indexOf(iSort) >= 0){
			iSort = Math.floor(Math.random() * totalJanelas);
		}
		sortJanela.push(iSort);
		sprites[encontrar('janela', iSort)].srcX = 130;//130 janela aberta

		if (Math.floor(Math.random() * 2)) {
			sprites.push(new Sprite('images/amazona.png', 'vilao', 5, 8, 55, 25, sprites[encontrar('janela', iSort)].posX+5, sprites[encontrar('janela', iSort)].posY+5));//-->
		}else{
			sprites.push(new Sprite('images/amazona.png', 'vilao', 209, 8, 55, 25, sprites[encontrar('janela', iSort)].posX-14, sprites[encontrar('janela', iSort)].posY+5));//<--
		}
	}
	setTimeout(function(){ viloes(proporcao) }, 6000);//ta chamando de novo ao chamar startFase()
}
function startFase(fase) {
	andares = 7 +fase * 5;
	sprites = [];
	GLOBAIS.paredeLar=30;
	predio(andares);
	construcao(2,1 + fase);//(folga a diminuir, niveis ou andares)
	//ponta da teia
	sprites.push(new Sprite('images/teia3.png', 'teia', 3, 3, 9, 9, 0, 0));//0, 0, 15, 15,
	//player
	sprites.push(new Sprite('images/Spider-Man.png', 'player', 136, 208, 23, 36, cnv.width/2-40.5, cnv.height-35));
	let vl = 0;
	(vl < 0.6) ? vl += 0.1 : null;
	viloes(vl);//(porcentagem % de viloes nas janelas do predio)
	sprites.push(new Sprite('images/background.png', 'placar', 575, 1740, 65, 35, 0, cnv.height - 35));//quadro
	sprites.push(new Sprite('images/teia3.png', 'placar', 0, 0, 15, 15, 0, cnv.height - 15));//teia
	//sprites[BUFFER.indexPlayer].img.onload = function(){
		//(fase) ? loop() : null;//executar somente uma vez quando fase é 0...
	//}
}

function encontrar(flag, n){//descobre index do objeto que corresponda a flag com maior index do array
	let num = n;
	for (let i = sprites.length - 1; i >= 0; i--) {
		if (sprites[i].flag == flag) {
			if(!num){
				return i;
			}
			num--;
		}
	}
    return false;
}
function contar(obj){//descobre quantos objetos com a mesma flag tem em jogo
    let countObj = 0;
	for (let i = sprites.length - 1; i >= 0; i--) {
		if (sprites[i].flag == obj) {
			countObj++
		}
	}
    return countObj;
}
