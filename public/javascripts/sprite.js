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
		if (this.flag == 'vilao') {
			this.escala = 0.7;
		}
		if (this.flag == 'vilao' && colide(this,sprites[BUFFER.indexTeia]) && sprites[BUFFER.indexTeia].lar > 10) {
			//identificar lado que o vilão está olhando
			this.srcY = 288;
			this.posY -= 15;
			this.lar = 70;
			this.alt = 45;
			this.flag = 'golpe';
			if (this.srcX == 5) {//-->
				this.srcX = 73;//-->				
			}
			if (this.srcX == 209) {//<-- 
				//console.log(sprites[BUFFER.indexTeia].posX - this.posX < this.lar);
				if (sprites[BUFFER.indexTeia].posX - this.posX < this.lar && sprites[BUFFER.indexTeia].posX - this.posX > 0) { //essa vira de lado
					this.srcX = 73;
					this.posX += this.lar/4;
					//this.flag = 'vilao';
				}else{
					this.srcX = 207;//<--				
				}				
			}
			//homem aranha cai...
			GLOBAIS.caindo = true;
			GLOBAIS.teiaY = 0;
			GLOBAIS.teiaX = 0;
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