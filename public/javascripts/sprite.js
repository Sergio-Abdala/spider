function Sprite(imgSrc, flag, srcX, srcY, lar, alt, posX, posY){
	//atributos.............................
		this.img = new Image();
		this.img.src = imgSrc;
        this.srcX = srcX;
		this.srcY = srcY;
        this.lar = lar;
		this.alt = alt;
		this.escala = 1;
        this.posX = posX;
		this.posY = posY;
        this.movRight = false;
		this.movLeft = false;
		this.movUp = false;
		this.movDown = false;
		this.speed = 1;
        this.flag = flag;
		this.status = false;
		this.frequencia = 26;
		this.contLoop = 0;
    //metodos..............................
    this.render = function(){//renderizar em tela...
        //if (this.exibir) {
            ctx.drawImage(this.img, this.srcX, this.srcY, this.lar, this.alt, this.posX, this.posY, this.lar*this.escala, this.alt*this.escala);
        //}		
    }
    this.exe = function(){
        //movimento 
        if(this.movRight){
            this.posX += this.speed;
            
        }else if(this.movLeft){
            this.posX -= this.speed;
            
        }		
        if (this.movUp) {
            this.posY -= this.speed;
			if(this.flag == 'player'){
				
				(GLOBAIS.dist > 0) ? GLOBAIS.dist-- : GLOBAIS.dist++;
			}
        }else if(this.movDown){
            this.posY += this.speed;
        }
		//
		if (this.flag == 'vilao') {
			this.escala = 0.7;
			if(colide(this,sprites[encontrar('teia')]) && sprites[encontrar('teia')].lar > 10) {//vilão corta teia
				//identificar lado que o vilão está olhando
				this.srcY = 288;
				this.posY -= 15;
				this.lar = 70;
				this.alt = 45;
				this.flag = 'golpe';
				sprites[encontrar('teia')].lar = 5;//evita homem aranha subir mantendo up pressionado...
				if (this.srcX == 5) {//-->
					this.srcX = 73;//-->				
				}
				if (this.srcX == 209) {//<-- 
					//console.log(sprites[encontrar('teia')].posX - this.posX < this.lar);
					if (sprites[encontrar('teia')].posX - this.posX < this.lar && sprites[encontrar('teia')].posX - this.posX > 0) { //essa vira de lado
						this.srcX = 73;
						this.posX += this.lar/4;
						this.posY += this.lar/25;
						//this.flag = 'vilao';
					}else{
						this.srcX = 207;//<--
						this.posX -= this.lar/25;
					}				
				}
				//homem aranha cai...
				GLOBAIS.caindo = true;		
				GLOBAIS.teiaY = 0;
				GLOBAIS.teiaX = 0;
			}
		}		
		if (this.flag == 'superVilao') {
			if (this.contLoop > this.frequencia) {//animação
				this.contLoop = 0;
				
				if (this.srcY == 522) {//doende verde... srcY = 522
					if (this.movRight) {
						(this.srcX == 0) ? this.srcX = 26 : this.srcX = 0;
					}
					if (this.movLeft) {
						(this.srcX == 168) ? this.srcX = 193 : this.srcX = 168;
					}
	
					if (this.posX > cnv.width - this.lar) {
						this.movLeft = true;
						this.movRight = false;
						this.srcX = 51;
					}
					if (this.posX < 0) {
						this.movRight = true;
						this.movLeft = false;
						this.srcX = 51;
					}
				}
				
				if (this.srcY == 386) {//abutre... srcY = 388
					if (this.srcX == 0) {
						this.srcX = 32;
					} else if(this.srcX == 32) {
						this.srcX = 64;
					}else if(this.srcX == 64){
						this.srcX = 97;
					}else if(this.srcX == 97) {
						this.srcX = 130;
					}else if(this.srcX == 130){
						this.srcX = 0;
					}
	
					if (this.posX > cnv.width) {
						this.posX = -30;
						this.flag = 'excluir'
					}
					if (this.posX < 0) {
						this.movRight = true;
						this.movLeft = false;
					}
				}
				
				if (this.srcY == 40){//eletro
					this.srcY = 82;
					(this.posX > cnv.width) ? this.flag='excluir' : null;
				}else if (this.srcY == 82) {
					this.srcY = 40;
					(this.posX > cnv.width) ? this.flag='excluir' : null;
				}
				//
			}
			this.contLoop++;
			if (colide(this,sprites[encontrar('teia')]) && sprites[encontrar('teia')].lar > 10) {//superVilão corta teia
				//homem aranha cai...
				GLOBAIS.caindo = true;						
				GLOBAIS.teiaY = 0;
				GLOBAIS.teiaX = 0;
			}
			if (colide(this, sprites[encontrar('player')])) {//colisão superVilão com player
				GLOBAIS.pontos--;
			}
		}
		if (this.flag == 'bomba' && this.posY > 25) {//acende bomba
			if (this.contLoop > this.frequencia) {
				this.contLoop = 0;
				(this.srcX == 65) ? this.srcX = 85 : this.srcX = 65;
			}
			this.contLoop++;
			//dar um jeiro de chamar apenas uma vez o timer para explosão da bomba
			if (!this.status) {
				this.status = true;
				setTimeout(() => {
					this.flag = 'explosao';					
				}, 3000);
			}
		}
		if (this.flag == 'explosao') {
			this.frequencia = 4;
			if (this.contLoop > this.frequencia) {//animação
				this.contLoop = 0;
				(this.srcX == 279) ? this.flag = 'excluir' : null;
				if(this.srcX == 242) {
					this.srcX = 279;
					this.escala = 1.5;//tem de ajustar para novo tamanho de sprite derrubar homem-aranha???
					this.posX -= 9;
					this.posY -= 8;
					this.lar = 58;
					this.alt = 58;
				}
				(this.srcX == 207) ? this.srcX = 242 : null;				
				(this.srcX == 171) ? this.srcX = 207 : null;
				if(this.srcX == 65 || this.srcX == 85) {
					//'inicio explosão'
					this.srcX = 171;
					this.srcY = 155;
					this.lar = 34;
					this.alt = 34;
					this.posX -= 10;
					this.posY -= 7;
				}
			}
			this.contLoop++;
			//colisão com player ou ponta da teia
			if (colide(this, sprites[encontrar('player')]) || colide(this, sprites[encontrar('teia')])) {
				GLOBAIS.caindo = true;		
				GLOBAIS.teiaY = 0;
				GLOBAIS.teiaX = 0;
			}
		}
		//player colidiu com ...
		if (colide(this,sprites[encontrar('player')]) && (this.flag == 'vilao' || this.flag == 'bomba')) {
			if(this.flag == 'vilao'){
				GLOBAIS.pontos += 50; // pontuação do vilão
				GLOBAIS.teiaCarga += 50;
				this.flag = 'excluir';
			}
			if (this.flag == 'bomba') {
				GLOBAIS.pontos += 100; // pontuação da bomba
				GLOBAIS.teiaCarga += 100;
				//this.flag = 'excluir'; //ao excluir player vai direto para posição da ponta teia
				this.flag = 'bombaDesarmada';
				this.posY -= this.alt;
			}
					
		}
		if (this.flag == 'bombaDesarmada' && this.posY < cnv.height) {
			this.posY++;
		}
		if (this.flag == 'teia') {
			//teia off...
			if ((pontaTeia() == 'player' && this.lar == 15) || (this.meioy() > sprites[encontrar('player')].meioy())) {
				this.srcX = 5;//diminui teia
				this.srcY = 5;
				this.lar = 5;
				this.alt = 5;
				GLOBAIS.teiaY = 0;
				GLOBAIS.teiaX = 0;
				sprites[encontrar('player')].movRight = false;//paraliza homem aranha
				sprites[encontrar('player')].movLeft = false;
				sprites[encontrar('player')].movUp = false;
				//sprite inicial
				sprites[encontrar('player')].srcX = 136;
				sprites[encontrar('player')].srcY = 208;
				sprites[encontrar('player')].lar = 23;
				sprites[encontrar('player')].alt = 36;
				sprites[encontrar('player')].posX = this.posX -4;
				GLOBAIS.ajustar = true;
			}
			if (this.meioy() > sprites[encontrar('player')].meioy()) {
				sprites[encontrar('player')].posX = this.posX;//remendo em avaliação???
			}
		}
		if (GLOBAIS.ajustar) {
			GLOBAIS.ajustar = false;
			if (sprites[encontrar('player')].meiox() > cnv.width/2 +1) {//+1 ou -1 é por que quando player ficava em posição tipo 150.5 trancava GLOBAIS.ajustar em true...
				GLOBAIS.ajustar = true;
				(this.flag != 'placar' && this.flag != 'vida') ? this.posX-- : null;
			}
			if (sprites[encontrar('player')].meiox() < cnv.width/2 -1) {
				GLOBAIS.ajustar = true;
				(this.flag != 'placar' && this.flag != 'vida') ? this.posX++ : null;
			}
			if (sprites[encontrar('player')].meioy() > cnv.height/2+1 + GLOBAIS.paredeLar) {
				//GLOBAIS.ajustar = true;
				//this.posY--;
			}
			if (sprites[encontrar('player')].meioy() < cnv.height/2 + GLOBAIS.paredeLar*1.5) {
				GLOBAIS.ajustar = true;
				(this.flag != 'placar' && this.flag != 'vida') ? this.posY++ : null;
			}
		}
		if(GLOBAIS.caindo){	
			sprites[encontrar('teia')].srcX = 5;
			sprites[encontrar('teia')].srcY = 5;
			sprites[encontrar('teia')].lar = 5;
			sprites[encontrar('teia')].alt = 5;

			sprites[encontrar('player')].movRight = false;
			sprites[encontrar('player')].movLeft = false;
			sprites[encontrar('player')].movUp = false;
			//
			sprites[encontrar('player')].srcX = 47;
			sprites[encontrar('player')].srcY = 262;
			sprites[encontrar('player')].lar = 31;
			sprites[encontrar('player')].alt = 27;

			if(abaixoDaTela()){
				(this.flag != 'player' && this.flag != 'teia' && this.flag != 'placar' && this.flag != 'vida') ? this.posY-=2 : null;
			}else{
				if(sprites[encontrar('player')].posY < cnv.height - sprites[encontrar('player')].alt) {
					sprites[encontrar('player')].movDown = true;
				}else{
					sprites[encontrar('player')].movDown = false;
					//homem aranha morre, se esburracha no chão
					sprites[encontrar('player')].srcX = 247;
					sprites[encontrar('player')].srcY = 280-14;
					sprites[encontrar('player')].lar = 40;
					//console.log('perdeu vida...');
					GLOBAIS.vida--;
					GLOBAIS.caindo = false;
				}
			}
		}
    }
}
Sprite.prototype.metax = function(){
	return (this.lar) / 2;
}
Sprite.prototype.metay = function(){
	return (this.alt) / 2;
}
Sprite.prototype.meiox = function(){
	return this.posX + this.metax();
}
Sprite.prototype.meioy = function(){
	return this.posY + this.metay();
}
function bloqueando(p1, p2){//(personagem, objeto)
	// p1 --> personagem
	// p2 --> parede bloqueante elemento de interação..
	//catetos distancia entre os pontos
	let catx = p1.meiox() - p2.meiox();
	let caty = p1.meioy() - p2.meioy();
	//soma das metades
	let somax = p1.metax() + p2.metax();
	let somay = p1.metay() + p2.metay();
	// tocando-se!!!!!!!!!!
	if (Math.abs(catx) < somax && Math.abs(caty) < somay) {
		
		let overlapx = somax - Math.abs(catx);
		let overlapy = somay - Math.abs(caty);
		if (overlapx >= overlapy) { //colisão por cima ou por baixo
			this.metaHorizontal = this.metaVertical = null;
			p1.movUp = p1.movDown = p1.movLeft = p1.movRight = false;
			if (caty > 0) { // bateu a cabeça do personagem colidiu parte de cima do personagem que esta sendo controlado
				p1.posY += overlapy;
				//
				console.log('bateu cabeça: '+ p2.id);				
			} else {
				p1.posY -= overlapy;
				//
				console.log('esta pisando: '+ p2.id);				
			}
		} else { // colisão pelos lados esquerda ou direita
			this.metaHorizontal = this.metaVertical = null;
			p1.movUp = p1.movDown = p1.movLeft = p1.movRight = false;
			if(catx > 0){ // colidiu na esquerda
				p1.posX += overlapx;
				//
				console.log('player bateu à esquerda: '+ p2.id);
			}else{
				p1.posX -= overlapx;
				//
				console.log('player bateu à direita: '+ p2.id);
			}
		}
	}
}
function empurando(p2, p1){//(personagem, objeto)
	// p1 --> personagem
	// p2 --> parede bloqueante elemento de interação..
	//catetos distancia entre os pontos
	let catx = p1.meiox() - p2.meiox();
	let caty = p1.meioy() - p2.meioy();
	//soma das metades
	let somax = p1.metax() + p2.metax();
	let somay = p1.metay() + p2.metay();
	// tocando-se!!!!!!!!!!
	if (Math.abs(catx) < somax && Math.abs(caty) < somay) {
		//p2.ver = false;
		//setTimeout(function(){ p2.ver = true; }, 1000);
		let overlapx = somax - Math.abs(catx);
		let overlapy = somay - Math.abs(caty);
		if (overlapx >= overlapy) { //colisão por cima ou por baixo
			if (caty > 0) { // bateu a cabeça do personagem colidiu parte de cima do personagem que esta sendo controlado
				p1.worldY += overlapy; 
			} else {
				p1.worldY -= overlapy;
			}
		} else { // colisão pelos lados esquerda ou direita
			if(catx > 0){ // colidiu na esquerda
				p1.worldX += overlapx;
			}else{
				p1.worldX -= overlapx;
			}
		}
	}
}
function colide(p1, p2){
	// p1 --> personagem
	// p2 --> parede bloqueante elemento de interação..
	//catetos distancia entre os pontos
	let catx = p1.meiox() - p2.meiox();
	let caty = p1.meioy() - p2.meioy();
	//soma das metades
	let somax = p1.metax() + p2.metax();
	let somay = p1.metay() + p2.metay();
	// tocando-se!!!!!!!!!!
	if (Math.abs(catx) < somax && Math.abs(caty) < somay) {
		//p2.ver = false;
		return true;
	}else{
		return false;
	}
}