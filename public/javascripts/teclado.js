//VARIAVEIS GLOBAIS...
var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
var porcentMouseX = porcentMouseY = null;

window.addEventListener("keydown", keydownHandler, false);
window.addEventListener("keyup", keyupHandler, false);
//
function keydownHandler(e){	
	switch(e.keyCode){
		case RIGHT:
			//sprites[BUFFER.indexPlayer].movRight = true;
			//sprites[BUFFER.indexPlayer].movLeft = false;
			//sprites[BUFFER.indexPlayer].movUp = false;
			//sprites[BUFFER.indexPlayer].movDown = false;
			GLOBAIS.teia = 'right';
		break;
		case LEFT:
			//sprites[BUFFER.indexPlayer].movRight = false;
			//sprites[BUFFER.indexPlayer].movLeft = true;
			//sprites[BUFFER.indexPlayer].movUp = false;
			//sprites[BUFFER.indexPlayer].movDown = false;
			GLOBAIS.teia = 'left';
		break;
		case UP:
			//sprites[1].movRight = false;
			//sprites[1].movLeft = false;
			//sprites[BUFFER.indexPlayer].movUp = true;
			//sprites[BUFFER.indexPlayer].movDown = false;
			(sprites[BUFFER.indexTeia].lar < 10) ? GLOBAIS.teia = 'up' : sprites[BUFFER.indexPlayer].movUp = true;
			(sprites[BUFFER.indexPlayer].meioy() < sprites[BUFFER.indexTeia].meioy()) ? sprites[BUFFER.indexPlayer].movUp = false : null;
		break;
		case DOWN:
			//sprites[1].movRight = false;
			//sprites[1].movLeft = false;
			sprites[BUFFER.indexPlayer].movUp = false;
			sprites[BUFFER.indexPlayer].movDown = true;
		break;
		case 32: //barra de espaço
			(GLOBAIS.teia) ? GLOBAIS.lancaTeia = true : null;
			/*sprites[BUFFER.indexTeia].srcX = 5;
			sprites[BUFFER.indexTeia].srcY = 5;
			sprites[BUFFER.indexTeia].lar = 5;
			sprites[BUFFER.indexTeia].alt = 5;*/
		break;
	}
}
function keyupHandler(e){//solta tecla
	//console.log(e.keyCode);
	switch(e.keyCode){
		case RIGHT:
			sprites[BUFFER.indexPlayer].movRight = false;
		break;
		case LEFT:
			sprites[BUFFER.indexPlayer].movLeft = false;
		break;
		case UP:
			sprites[BUFFER.indexPlayer].movUp = false;
			let distancia = sprites[BUFFER.indexPlayer].posY - sprites[BUFFER.indexTeia].posY;
			(GLOBAIS.dist > 0) ? GLOBAIS.dist = distancia : distancia *-1;
		break;
		case DOWN:
			sprites[BUFFER.indexPlayer].movDown = false;
		break;
		case 32: //solta barra de espaço
			GLOBAIS.lancaTeia = false;
			GLOBAIS.teia = null;
			if ((GLOBAIS.colide == 'parede' || GLOBAIS.colide == 'ferro' || GLOBAIS.colide == 'caboFerro') && sprites[BUFFER.indexTeia].lar < 10 && pontaTeia()) {
				sprites[BUFFER.indexTeia].srcX = 0;
				sprites[BUFFER.indexTeia].srcY = 0;
				sprites[BUFFER.indexTeia].lar = 15;
				sprites[BUFFER.indexTeia].alt = 15;
				GLOBAIS.dist = sprites[BUFFER.indexTeia].meiox() - sprites[BUFFER.indexPlayer].meiox();
				GLOBAIS.colide = null;
				GLOBAIS.caindo = false;
			}else{
				if (sprites[BUFFER.indexTeia].lar < 10) {
					console.log('homem aranha cai...');
					GLOBAIS.caindo = true;
					GLOBAIS.teiaY = 0;
					GLOBAIS.teiaX = 0;
				}				
			}
			
		break;
		case 33://pag up
			
		break;
		case 34://pag down
						
		break;
		case 48: // 0 numero...
			window.open("/help");
		break;
		case 49: // 1 numero...			
			
		break;
		case 50: // 2 numero...			
			
		break;
		case 51: // 3 numero...
			
		break;
		case 52: // 4 numero...
			
		break;
		case 53: // 5 numero...
			
		break;
		case 54: // 6 numero...
			
		break;
		case 55: // 7 numero...
			
		break;
		case 56: // 8 numero...
			
		break;
		case 57: // 9 numero...
			console.log('numero 9 <==> teclado...' );
		break;
		case 72: // h letra...
			console.log('letra h <==> teclado...' );
			window.open("/help");
		break;
		case 77: // m letra...
			console.log('letra m <==> teclado...');				
		break;
		case 80: // p letra...
			console.log('letra p <==> teclado...');
		break;
	}
}

cnv.addEventListener('click', event =>   //mouse
{
    let rect = cnv.getBoundingClientRect();
    //rect é a tela do canvas
    let x = event.clientX;// - rect.left;// - cnv.clientLeft;
    let y = event.clientY;// - rect.top;// - cnv.clientTop;

    //console.log(x +' , '+ y +' tamanho da tela? ' + rect.width +' , '+ rect.height);
     //porcentMouseX = x / rect.width;
     //porcentMouseY = y / rect.height;          

});