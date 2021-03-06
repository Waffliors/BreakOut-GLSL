let kl = 0, 
    kr = 0;

let scene,
    camera,
    aspect,
    frame = 0,
    frameIncrease = true,
    time,
    fovy,
    near,
    far,
    renderer,
    ball,
    ballPosX = 0,
    ballPosY = 0,
    reverseBallX = true,
    reverseBallY = true,
    ballSpeed = 0.25,
    table,
    tablePosX = 0,
    tablePosY = 0,
    tableSpeed = 0.5,
    walls = [],
	wallRandom = false,
    wallPosX = 0,
    wallPosY = 0,
    cont = 0,
    blocks = [],
	blocksRandom = [],
	blockCont = 0,
	blockColorSpeed = 7,
    blockPosX = 0,
    blockPosY = 0,
    randomTime = 0,
    camTurn = false,
    tempCam = 0.5,
    shake = false;

const maxBlocks = 120,
      maxWalls = 3;

function main()
{
    // 1 - Setup da Cena / Camera e Renderer
    setup();

    // 2.0 - Cria as geometrias
    getBlockData();
    getTableData();
    getBallData();
    getWallData();  
    drawBlocks(); 
    drawWalls();

    // 2.1 - Adicionar � cena    
    scene.add(table);
    scene.add(ball);
    // 3 - Criar luzes
    createLights();

    // 4 - Posicionar c�mera
    camera.position.z = 27.5;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    // 5 - Inicia Loop de Redesenho
    animate();
}

function animate() 
{
    renderer.render(scene, camera);
	blockCont++;
    moveBall();
    moveTable();
    breakBlock();
    hitWall();
    hitTable();
    randomColor();
    if (shake) {   
        tempCam *= -1;
        camera.translateX(tempCam);
    }

    requestAnimationFrame(animate);
}

function createLights()
{
    var ambient = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambient);
}

function getBlockData()
{
    let material,
        geometry = new THREE.BoxGeometry(3, 1, 1), // Dimens�es da geometria
        texture = new THREE.TextureLoader().load('Textures/Block.png' ), // Imagem de Textura
		chance;
				
    for(let i = 0; i < maxBlocks; i++)
    {		
		blocksRandom[i] = false;
		
        if(i < 20)
                material = new THREE.MeshLambertMaterial({color: 0xff0000, map: texture});
        else if (i < 40)
                material = new THREE.MeshLambertMaterial({color: 0xffaf00, map: texture});
        else if (i < 60)
                material = new THREE.MeshLambertMaterial({color: 0xffff00, map: texture});
        else if (i < 80)
                material = new THREE.MeshLambertMaterial({color: 0x00ff00, map: texture});
        else if (i < 100)
                material = new THREE.MeshLambertMaterial({color: 0x00bbff, map: texture});
        else if (i < 120)
                material = new THREE.MeshLambertMaterial({color: 0xaa55ff, map: texture});
		
        blocks[i] = new THREE.Mesh(geometry, material);
		
		chance = Math.random() * 100;
		
		if(chance <= 7)
			blocksRandom[i] = true;
    }
}

function drawBlocks()
{
    blockPosX = -30;
    blockPosY = 15;

    blocks.forEach(block => {
        scene.add(block);

        block.translateX(blockPosX);
        block.translateY(blockPosY);
		
        blockPosX += 3;

        if (blockPosX >= 30)
        {
            blockPosX = -30;
            blockPosY -= 1;
        }
    });	    
}

function randomColor()
{
	let letters = '23456789ABCD',
		color = '0x',
		i;
		
	for(i = 0; i < 6; i++)
		color += letters[Math.floor(Math.random() * 12)];
		
	for(i = 0; i < maxBlocks; i++)
		if(blocksRandom[i] && blockCont % blockColorSpeed === 0)
			blocks[i].material.color.setHex(color);
		
	if(wallRandom && blockCont % blockColorSpeed === 0)
	{
		walls[0].material.color.setHex(color);
		walls[1].material.color.setHex(color);
		walls[2].material.color.setHex(color);
	}
	else if(!wallRandom)
	{
		walls[0].material.color.setHex(0x1e5da0);
		walls[1].material.color.setHex(0x1e5da0);
		walls[2].material.color.setHex(0x1e5da0);
	}	
}

function drawWalls()
{
    wallPosX = -40;
    wallPosY = 0;
    
    walls.forEach(wall => {
        
        cont++;
        scene.add(wall);

        wall.translateX(wallPosX);
        wall.translateY(wallPosY);
		
        wallPosX += 80;

        if (cont === 3)
        {
            wall.position.x = 0;
            wall.position.y = 20.25;
            wall.position.z = -0.01;
        }
    });	
}

function getTableData()
{
	let geometry = new THREE.CylinderGeometry(2, 1, 1, 64), // Dimens�es da geometria
		texture = new THREE.TextureLoader().load('Textures/Block.png' ), // Imagem de Textura
		material = new THREE.MeshLambertMaterial({color: 0xffffff, map: texture});
		
    table = new THREE.Mesh(geometry, material);
	
	tablePosY = -15;
    table.translateY(tablePosY);
}

function getBallData()
{
	let geometry = new THREE.SphereGeometry(0.5, 32, 32), // Dimens�es da geometria
		texture = new THREE.TextureLoader().load('Textures/Cube.png' ), // Imagem de Textura
		material = new THREE.MeshLambertMaterial({color: 0xff8800});
		
    ball = new THREE.Mesh(geometry, material);	
	ballPosY = -14;
	ball.translateY(ballPosY);
}

function getWallData()
{ 
    let material,
        geometry,
        texture; // Imagem de Textura
        
    for(let i = 0; i < maxWalls; i++)
    {		
        if(i !== 2)
        {
			texture = new THREE.TextureLoader().load('Textures/Wall-Side.png');
			texture.wrapS = THREE.RepeatWrapping;
            texture.repeat.y = 1;
            geometry = new THREE.BoxGeometry(1, 42, 1), // Dimens�es da geometria
            material = new THREE.MeshLambertMaterial({color: 0x1e5da0 , map: texture});
        }
        else
        {
			texture = new THREE.TextureLoader().load('Textures/Wall-Top.png')
            geometry = new THREE.BoxGeometry(79, 1, 1), // Dimens�es da geometria
            material = new THREE.MeshLambertMaterial({color: 0x1e5da0 , map: texture});
        }
		
        walls[i] = new THREE.Mesh(geometry, material);		
    }    
}

function moveBall()
{
	ballPosX = (reverseBallX === true ? ballSpeed : ballSpeed * -1);
	ballPosY = (reverseBallY === true ? ballSpeed : ballSpeed * -1);
	ball.translateX(ballPosX);
    ball.translateY(ballPosY);
}

function moveTable()
{
    tablePosX = (kl + kr) * tableSpeed;
    table.translateX(tablePosX);
    
    if(table.position.x < -37)
        table.position.x = -37;
    
    if(table.position.x > 37)
        table.position.x = 37;
}

function breakBlock()
{
    let ballLeftSide,
        ballRightSide,
        ballTopSide,
        ballBottomSide,
        blockLeftSide,
        blockRightSide,
        blockTopSide,
        blockBottomSide;

    ballLeftSide = ball.position.x - 0.5;
    ballRightSide = ball.position.x + 0.5;
    ballTopSide = ball.position.y + 0.5;
    ballBottomSide = ball.position.y - 0.5;

    for(let i = 0; i < maxBlocks; i++)
    {
        if(scene.getObjectById(blocks[i].id) !== undefined)
        {
            blockLeftSide = blocks[i].position.x - 1.5;
            blockRightSide = blocks[i].position.x + 1.5;
            blockTopSide = blocks[i].position.y + 0.5;
            blockBottomSide = blocks[i].position.y - 0.5;
            
            // Block Bottom Side
            if(ballTopSide >= blockBottomSide && ballTopSide <= blockTopSide && ballLeftSide >= blockLeftSide && ballRightSide <= blockRightSide)
            {
                scene.remove(scene.getObjectById(blocks[i].id));
                reverseBallY = false;
				
				if(blocksRandom[i])
				{
                    randomTime = 0;
                    wallRandom = true;
                    shake = true;
                    setTimeout(timeRandom, 10000);
				}					
            }     
            // Block Top Side
            else if(ballBottomSide <= blockTopSide && ballBottomSide >= blockBottomSide && ballLeftSide >= blockLeftSide && ballRightSide <= blockRightSide)
            {
                scene.remove(scene.getObjectById(blocks[i].id));    
                reverseBallY = true;
				
				if(blocksRandom[i])
				{
                    randomTime = 0;
                    wallRandom = true;
                    shake = true;
                    setTimeout(timeRandom, 10000);
				}		
            }
            // Block Left Side
            else if(ballRightSide >= blockLeftSide && ballRightSide <= blockRightSide && ballTopSide <= blockTopSide && ballBottomSide >= blockBottomSide)
            {
                scene.remove(scene.getObjectById(blocks[i].id)); 
                reverBallX = false;  
				
				if(blocksRandom[i])
				{
                    randomTime = 0;
                    wallRandom = true;
                    shake = true;
                    setTimeout(timeRandom, 10000);
				}		
            }
            // Block Right Side
            else if(ballLeftSide <= blockRightSide && ballLeftSide >= blockLeftSide && ballTopSide <= blockTopSide && ballBottomSide >= blockBottomSide)
            {
                scene.remove(scene.getObjectById(blocks[i].id));  
                reverBallX = true;   
				
				if(blocksRandom[i])
				{
                    randomTime = 0;
                    wallRandom = true;
                    shake = true;
                    setTimeout(timeRandom, 10000);
				}		
            }
        }
    }
}

function hitWall()
{
    let ballLeftSide,
        ballRightSide,
        ballTopSide;

    ballLeftSide = ball.position.x - 0.5;
    ballRightSide = ball.position.x + 0.5;
    ballTopSide = ball.position.y + 0.5;

    if(ballRightSide <= walls[0].position.x + 0.5)
	{
        reverseBallX = true;
	}
	else if(ballRightSide <= walls[0].position.x + 0.5)
	{
		camTurn = true;
	}

    if(ballLeftSide >= walls[1].position.x - 0.5)
	{
        reverseBallX = false;
	}
	else if(ballLeftSide >= walls[1].position.x - 0.5)
	{
		camTurn = true;	
	}

    if(ballTopSide >= walls[2].position.y - 0.5)
        reverseBallY = false;
}

function hitTable()
{
    let ballBottomSide,
        ballTopSide,
        ballLeftSide,
        ballRightSide;

    ballTopSide = ball.position.y + 0.5;
    ballBottomSide = ball.position.y - 0.5;
    ballRightSide = ball.position.x + 0.5;
    ballLeftSide = ball.position.x - 0.5;

    if(ballBottomSide <= table.position.y + 0.5 && ballBottomSide >= table.position.y - 0.5 && ballLeftSide >= table.position.x - 1.5 && ballRightSide <= table.position.x + 1.5)
        reverseBallY = true;
}

function timeRandom()
{
    wallRandom = false;
    shake = false;
}

function setup()
{
    aspect = window.innerWidth / window.innerHeight;
    fovy = 75;
    near = 0.1;
    far = 1000;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(fovy, aspect, near, far);
    renderer = new THREE.WebGLRenderer();
	
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function keyUp(evt)
{
    if(evt.key === "a") return kl = 0;
    if(evt.key === "d") return kr = 0;
}

function keyPress(evt)
{    
    if(evt.key === "a") return kl = -1;
    
    if(evt.key === "d") return kr = 1;
}

function resize()
{
	let width = window.innerWidth;
	let height = window.innerHeight;
    
	camera.aspect = width / height; 
    camera.updateProjectionMatrix();

	renderer.setSize( width, height);
}

main();
window.addEventListener('resize', resize);
window.addEventListener("keyup", keyUp);
window.addEventListener("keypress", keyPress);