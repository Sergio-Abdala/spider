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
	dist: 0, //distancia do balançar
	ajustar: false,
	paredeLar:30,//espacoVazio dos blocos que compoem as paredes do predio
	paredeAlt: 35,//altura dos blocos que compoem as paredes do predio
	predioBlocos: 10, //aceita somente numeros pares de blocos...
	predioDiferencaespacoVazio: 2,
	predioDivide: 7,//a cada x andares diminui o predio
	caindo: false,
	GLOBAIS: 0,
	pause: false,
	ranking: [1,2,3,4,5],
	nomes: ['um','dois','tres','quatro','cinco']
}
const janela = [1, 130, 66, 98, 259];//srcX
const jnl = 2;//maximo 5 janelas diferentes... repensar

var andares;
var BUFFER = {//BUFFER para reduzir for's no codigo...
	indexTeia: encontrar('teia'),
	indexPlayer: encontrar('player')
}

startFase();
loop();
//************************************************************************************************ */
function loop(){	
	BUFFER = {//BUFFER para reduzir for's no codigo...
		indexTeia: encontrar('teia'),
		indexPlayer: encontrar('player'),
		vida: GLOBAIS.vida
	}
    // limpar tela
	ctx.clearRect(0,0,cnv.width,cnv.height);
	
	for (let i = 0 ; i < sprites.length; i++) {//percorre array de sprites for principal...
		if (!GLOBAIS.pause) {/////////////
			sprites[i].exe();/////////////////  movimento do jogo...            
			(sprites[i].flag == 'player') ? teia() : null;//chama função que desenha teia antes desenhar aranha
		}////////////////////////////////////
		sprites[i].render();/////////////// renderiza na tela...
		//
		if (sprites[i].flag == 'fimDaFase' && colide(sprites[i], sprites[BUFFER.indexPlayer])) {
			//alert('fimDaFase');			
			GLOBAIS.teiaX = 0;
			GLOBAIS.teiaY = 0;
			GLOBAIS.pause = true;			
			if (GLOBAIS.teiaCarga && GLOBAIS.teiaCarga > 0) {
				GLOBAIS.pontos++;
				GLOBAIS.teiaCarga--;
			} else {
				sprites[i].flag = 'novaFase';
				GLOBAIS.fase++;
				GLOBAIS.vida++;
				setTimeout(() => {
					startFase();
				}, 1000);
			}
		}
		//remendo porco...
		if (sprites[i].flag == 'placar') {
			sprites[i].posX = 0;
			if(sprites[i].lar > 20){
				//quadro negro
			}else{
				//teia
			}
		}
	}	
	//placar
    ctx.font = "15px Arial";//  TEXTO...
	ctx.fillStyle = 'red';
    ctx.fillText(GLOBAIS.pontos, 13,  cnv.height - 18);
	ctx.font = "10px Arial";//  TEXTO...
	ctx.fillStyle = 'white';
	ctx.fillText(GLOBAIS.teiaCarga+' m', 17,  cnv.height - 5);

	for (let i = 0 ; i < sprites.length; i++){//exclui do array
		if (sprites[i].flag == 'excluir' || sprites[i].flag == 'delete') {
			sprites.splice(i, 1);
		}
	}
	(BUFFER.vida > GLOBAIS.vida) ? startFase() : null;
	(!GLOBAIS.vida) ? endGame() : null;
	organizarSprites();
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
		let limteia = -95;
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
			//console.log('com balanço dist--> '+ GLOBAIS.dist );
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
function pontaTeia() {//retorna oq esta tocando na ponta da teia no momento elemento mais a frente do array acima da pilha dos ultimos...
	for (let i = sprites.length-1; i >=0 ; i--) {
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
		let srcXparede;
		switch (GLOBAIS.fase) {//tipo de parede da fase
			case 0:
				srcXparede = 705;
				break;
			case 1:
				srcXparede = 640;
				break;
			case 2:
				srcXparede = 511;
				break;
			case 3:
				srcXparede = 832;
				break;
			case 4:
				srcXparede = 768;
				break;
			case 5:
				srcXparede = 960;
				break;
		
			default:
				srcXparede = 896;
				break;
		}
		for (let j = 0; j < GLOBAIS.predioBlocos; j++) {// parede srcX: 832 768 960 705 640 511
			sprites.push(new Sprite('images/background.png', 'parede', srcXparede, 99, GLOBAIS.paredeLar, GLOBAIS.paredeAlt, GLOBAIS.paredeLar*j + ajuste, cnv.height-GLOBAIS.paredeAlt - GLOBAIS.paredeAlt*i));
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
		(GLOBAIS.fase) ? sprites.push(new Sprite('images/Bomb - General Sprites.png', 'bomba', 45, 134, 14, 18, inicial + espacoVazio + blocoCentralLar/2 -7, cnv.height - GLOBAIS.paredeAlt*andares - GLOBAIS.paredeAlt - blocoCentralAlt - (GLOBAIS.paredeAlt*3 - blocoCentralAlt + barraFerroLarg)*k - 18)) : null;

		sprites.push(new Sprite('images/background.png', 'ferro', 899, 160, blocoCentralLar, blocoCentralAlt, inicial + espacoVazio*3, cnv.height - GLOBAIS.paredeAlt*andares - GLOBAIS.paredeAlt - blocoCentralAlt - (GLOBAIS.paredeAlt*3 - blocoCentralAlt + barraFerroLarg)*k));
		(GLOBAIS.fase) ? sprites.push(new Sprite('images/Bomb - General Sprites.png', 'bomba', 45, 134, 14, 18, inicial + espacoVazio*3 + blocoCentralLar/2 -7, cnv.height - GLOBAIS.paredeAlt*andares - GLOBAIS.paredeAlt - blocoCentralAlt - (GLOBAIS.paredeAlt*3 - blocoCentralAlt + barraFerroLarg)*k - 18)) : null;

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
	GLOBAIS.teiaCarga = altura*-2 + cnv.height;//???
}
function viloes() {
	//limpar vilões do array
	for (let i = 0; i < sprites.length; i++) {
		let spr = sprites[i];
		(spr.flag == 'vilao' || spr.flag == 'golpe') ? spr.flag = 'excluir' : null;
	}
	//rastrear janelas
	let totalJanelas = contar('janela');
	let sortJanela = [];
	let iSort = Math.floor(Math.random() * totalJanelas);
	for (let i = 0; i < totalJanelas*GLOBAIS.proporcao; i++) {
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
	let sup = Math.floor(Math.random() * 5);
	if (!sup && GLOBAIS.fase) {
		(Math.floor(Math.random() * 2)) ? superViloes('abutre') : superViloes('eletro');
	}
	setTimeout(function(){ viloes(); }, 6000);//ta chamando de novo ao chamar startFase()???
}
function superViloes(vilao) {
	switch (vilao) {
		case 'abutre':
			sprites.push(new Sprite('images/bosses.png', 'superVilao', 0, 386, 30, 60, -50, 0));
			sprites[encontrar('superVilao')].escala = .95;
			sprites[encontrar('superVilao')].movRight = true;
			sprites[encontrar('superVilao')].frequencia = 10;
			console.log('insert abutre...');
			break;
		case 'eletro':
			sprites.push(new Sprite('images/bosses.png', 'superVilao', 0, 40, 24, 40, -50, 0));
			//sprites[encontrar('superVilao')].escala = .95;
			sprites[encontrar('superVilao')].movRight = true;
			sprites[encontrar('superVilao')].frequencia = 26;
			console.log('insert eletro...');
			break;
	
		default://duende verde
			let posY = GLOBAIS.paredeAlt * andares/2 - cnv.height;
			sprites.push(new Sprite('images/bosses.png', 'superVilao', 0, 522, 24, 44, 0, posY*-1));
			sprites[encontrar('superVilao')].escala = .9;
			sprites[encontrar('superVilao')].movRight = true;
			console.log('insert duende...');
			break;
	}	
}
function vida() {
	for (let i = 0; i < GLOBAIS.vida; i++) {
		//const element = array[i];
		sprites.push(new Sprite('images/Spider-Man.gif', 'vida', 318, 4220, 20, 18, 65 +i*15, cnv.height - 18));
	sprites[encontrar('vida')].escala = .7;
	}
	
}
function startFase() {
	GLOBAIS.pause = false;
	andares = 7 +GLOBAIS.fase * 5;
	sprites = [];
	GLOBAIS.paredeLar=30;
	predio(andares);
	construcao(2,1 + GLOBAIS.fase);//(folga a diminuir, niveis ou andares)
	//ponta da teia
	sprites.push(new Sprite('images/teia3.png', 'teia', 3, 3, 9, 9, 0, 0));//0, 0, 15, 15,
	//player
	sprites.push(new Sprite('images/Spider-Man.png', 'player', 136, 208, 23, 36, cnv.width/2-40.5, cnv.height-35));
	(GLOBAIS.fase) ? GLOBAIS.proporcao = GLOBAIS.fase/10 : GLOBAIS.proporcao = 0.1;
	(!GLOBAIS.fase) ? viloes() : null;//(porcentagem % de viloes nas janelas do predio) //chama somente uma vez quando GLOBAIS.fase = 0; 
	sprites.push(new Sprite('images/background.png', 'placar', 575, 1740, 65, 35, 0, cnv.height - 35));//quadro
	sprites.push(new Sprite('images/teia3.png', 'placar', 0, 0, 15, 15, 0, cnv.height - 15));//teia
	vida();
	(GLOBAIS.fase) ? superViloes() : null;//superViloes default: duende verde...
}
function endGame(){
	if (!GLOBAIS.pause) {
		sprites.push(new Sprite('images/spider-man-atari-2600', 'score', 0, 45, 749, 515, 0, 0));
		sprites[encontrar('score')].escala = .4;
		//ranking... preencher array aqui???
		for (let i = 0; i < 5; i++) {
			if (getCookie('aranha'+i)) {
				GLOBAIS.ranking[i] = getCookie('aranha'+i);
				GLOBAIS.nomes[i] = getCookie('homem'+i);
			}
		}
		//organizar array do score...
		let troca = false;
		GLOBAIS.ranking.push(GLOBAIS.pontos);
		GLOBAIS.nomes.push(prompt('digite seu nome...').toLocaleUpperCase());
		
		do {
			troca = false;
			for (let i = 0; i < GLOBAIS.ranking.length-1; i++) {
				if (GLOBAIS.ranking[i] < GLOBAIS.ranking[i+1]) {
					let memo = GLOBAIS.ranking[i+1];
					GLOBAIS.ranking[i+1] = GLOBAIS.ranking[i];
					GLOBAIS.ranking[i] = memo;
					//
					memo = GLOBAIS.nomes[i];
					GLOBAIS.nomes[i] = GLOBAIS.nomes[i+1];
					GLOBAIS.nomes[i+1] = memo;
					troca = true;
				}
			}
		} while (troca);
		//preencher cookies aqui???
		for (let i = 0; i < 5; i++) {
			setCookie('aranha'+i, GLOBAIS.ranking[i], 3650);
			setCookie('homem'+i, GLOBAIS.nomes[i], 3650)
		}
	}
	GLOBAIS.pause = true;
	GLOBAIS.proporcao = 0//parar sorteio de viloes...

	sprites[encontrar('player')].srcX = 247;
	sprites[encontrar('player')].srcY = 255;
	sprites[encontrar('player')].lar = 40;

    ctx.font = "25px Arial";//  TEXTO...
	ctx.fillStyle = 'red';
    ctx.fillText('SEU SCORE... '+ GLOBAIS.pontos, 4,  cnv.height/5);
	
	ctx.font = "12px Arial";
	ctx.fillStyle = '#000';
	for (let i = 0; i < GLOBAIS.ranking.length-1; i++) {
		//const element = GLOBAIS.ranking[i];
		ctx.fillText(i+1+'St  '+ GLOBAIS.ranking[i] +'  '+ GLOBAIS.nomes[i], 4,  cnv.height/5 + 15 +18*i);
	}
    
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
function organizarSprites () {
	//organizar array / pilha de sprites...
	let troca;
	do{//txt
		troca = false;			
		for (let i = sprites.length - 2; i >= 0; i--){
			//teste logico para piso / chão.......
			if (sprites[i].flag !== 'parede' && sprites[i+1].flag == 'parede') {
				troca = sprites[i];
				sprites[i] = sprites[i+1];
				sprites[i+1] = troca;
				troca = true;										
			}
			if (sprites[i].flag !== 'parede' && sprites[i].flag !== 'janela' && sprites[i+1].flag == 'janela') {
				troca = sprites[i];
				sprites[i] = sprites[i+1];
				sprites[i+1] = troca;
				troca = true;										
			}
			if (sprites[i].flag !== 'parede' && sprites[i].flag !== 'janela' && sprites[i].flag !== 'ferro' && sprites[i+1].flag == 'ferro') {
				troca = sprites[i];
				sprites[i] = sprites[i+1];
				sprites[i+1] = troca;
				troca = true;										
			}
			if (sprites[i].flag !== 'parede' && sprites[i].flag !== 'janela' && sprites[i].flag !== 'ferro' && sprites[i].flag !== 'caboFerro' && sprites[i+1].flag == 'caboFerro') {
				troca = sprites[i];
				sprites[i] = sprites[i+1];
				sprites[i+1] = troca;
				troca = true;										
			}
			if (sprites[i].flag !== 'parede' && sprites[i].flag !== 'janela' && sprites[i].flag !== 'ferro' && sprites[i].flag !== 'caboFerro' && sprites[i].flag !== 'vilao' && sprites[i+1].flag == 'vilao') {
				troca = sprites[i];
				sprites[i] = sprites[i+1];
				sprites[i+1] = troca;
				troca = true;
			}

			if (sprites[i].flag == 'player' && i < sprites.length-1) {
				troca = sprites[i];
				sprites[i] = sprites[sprites.length-1];
				sprites[sprites.length-1] = troca;
				troca = true;
			}
			if (sprites[i].flag == 'placar' && sprites[i].lar == 15 && i < sprites.length-2) {
				troca = sprites[i];
				sprites[i] = sprites[sprites.length-2];
				sprites[sprites.length-2] = troca;
				sprites[sprites.length-2].posY = cnv.height - sprites[sprites.length-2].alt;
				troca = true;
			}
			if (sprites[i].flag == 'placar' && sprites[i].lar > 15 && i < sprites.length-3) {
				troca = sprites[i];
				sprites[i] = sprites[sprites.length-3];
				sprites[sprites.length-3] = troca;
				sprites[sprites.length-3].posX = 0;
				sprites[sprites.length-3].posY = cnv.height - sprites[sprites.length-3].alt;
				troca = true;
			}
			
			/*/
				if (sprites[i]. == '' && sprites[i+1]. !== '' ) {
					troca = sprites[i];
					sprites[i] = sprites[i+1];
					sprites[i+1] = troca;
					troca = true;					
				}
			/*/
		}
	}while(troca);	
}

function startGame(fase) {
	GLOBAIS.fase = fase;
	startFase();
}
//
function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
	  let c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return false;
}
function deleteCokie(cname){
	document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
function zerarPlacar() {
	for (let i = 0; i < 5; i++) {
		deleteCokie('aranha'+i);
		deleteCokie('homem'+i);
	}	
}