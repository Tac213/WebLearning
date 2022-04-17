// @ts-check

// base class of element in the canvas
class Actor
{
    /**
     * @param {World} [world]
     */
    constructor(world)
    {
        this.world = world;
        this.visible = true;
    }

    /**
     * tick the actor
     * will be called on every logic frame
     * logic frame is before render frame
     * @returns {void} 
     */
    tick() {}

    /**
     * draw the actor
     * will be called on every render frame
     * render from is after logic frame
     * @param {CanvasRenderingContext2D} [renderContext]
     * @returns {void} 
     */
    draw(renderContext) {}

    /**
     * get world
     * @returns {World} 
     */
    getWorld()
    {
        return this.world;
    }

    /** set visibility of actor
     * @param {boolean} isVisible
     * @returns {void} 
     */
    setVisibility(isVisible)
    {
        this.visible = isVisible;
    }

}


class GameMode extends Actor
{
    /**
     * will be called when the ball hits ground
     * @returns {void}
     */
    onBallHitGround()
    {
        this.getWorld().iterateBricks((brick) =>
        {
            brick.setVisibility(true);
        });
        this.getWorld().getPlayerState().resetScore();
    }
}


class PlayerController extends Actor
{
    /**
     * @param {World} [world]
     */
    constructor(world)
    {
        super(world);
        this.paddle = null;
    }

    /**
     * set the paddle that is controlled by player
     * @param {Paddle} paddle
     * @returns {void} 
     */
    setPaddle(paddle)
    {
        this.paddle = paddle;
    }

    /**
     * will be called when key down
     * @param {KeyboardEvent} event
     * @returns {void} 
     */
    onKeyDown(event)
    {
        if (this.paddle === null || this.paddle == undefined)
        {
            return;
        }
        if (event.key == 'Left' || event.key == 'ArrowLeft')
        {
            this.paddle.moveLeft();
        }
        else if (event.key == 'Right' || event.key == 'ArrowRight')
        {
            this.paddle.moveRight();
        }
    }

    /**
     * will be called when key up
     * @param {KeyboardEvent} event
     * @returns {void} 
     */
    onKeyUp(event)
    {
        if (this.paddle === null || this.paddle == undefined)
        {
            return;
        }
        if (
            event.key == 'Left' ||
            event.key == 'ArrowLeft' ||
            event.key == 'Right' ||
            event.key == 'ArrowRight'
        )
        {
            this.paddle.stopMove();
        }
    }

}


class PlayerState extends Actor
{
    /**
     * @param {World} world 
     */
    constructor(world)
    {
        super(world);
        this.x = this.getWorld().width - 100;
        this.y = 30;
        this.score = 0;
    }

    resetScore()
    {
        this.score = 0;
    }

    increaseScore()
    {
        this.score++;
    }

    /**
     * draw player state on screen
     * @param {CanvasRenderingContext2D} [renderContext]
     * @returns {void} 
     */
    draw(renderContext)
    {
        renderContext.font = '20px Arial';
        renderContext.fillText(`Score: ${this.score}`, this.x, this.y);
    }

}


// brick properties
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
};


class Brick extends Actor
{

    /**
     * @param {World} [world]
     */
    constructor(world)
    {
        super(world);
        this.x = 0;
        this.y = 0;
        this.width = brickInfo.w;
        this.height = brickInfo.h;
        this.padding = brickInfo.padding;
        this.offsetX = brickInfo.offsetX;
        this.offsetY = brickInfo.offsetY;
    }

    /**
     * draw brick
     * @param {CanvasRenderingContext2D} [renderContext]
     * @returns {void} 
     */
    draw(renderContext)
    {
        renderContext.beginPath();
        renderContext.rect(this.x, this.y, this.width, this.height);
        renderContext.fillStyle = this.getWorld().getActorFillStyle(this);
        renderContext.fill();
        renderContext.closePath();
    }

    /**
     * simply overload set visible to increase score
     * @param {boolean} isVisible 
     */
    setVisibility(isVisible)
    {
        super.setVisibility(isVisible);
        if (!isVisible)
        {
            this.getWorld().getPlayerState().increaseScore();
        }
    }

}


class Ball extends Actor
{

    /**
     * @param {World} [world]
     */
    constructor(world)
    {
        super(world);
        this.x = this.getWorld().width / 2;
        this.y = this.getWorld().height / 2;
        this.radius = 10;
        this.speed = 4;
        this.dx = this.speed;
        this.dy = -this.speed;
    }

    /**
     * tick the ball
     * @returns {void} 
     */
    tick()
    {
        this.move();
    }

    /**
     * draw ball
     * @param {CanvasRenderingContext2D} [renderContext]
     * @returns {void} 
     */
    draw(renderContext)
    {
        renderContext.beginPath();
        renderContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        renderContext.fillStyle = this.getWorld().getActorFillStyle(this);
        renderContext.fill();
        renderContext.closePath();
    }


    /**
     * move the ball
     * @returns {void} 
     */
    move()
    {
        this.x += this.dx;
        this.y += this.dy;

        // wall collision right / left
        if (this.x + this.radius > this.getWorld().width || this.x - this.radius < 0)
        {
            this.dx *= -1;
        }

        // wall collsion bottom / top
        if (this.y + this.radius > this.getWorld().height || this.y - this.radius < 0)
        {
            this.dy *= -1;
        }

        // paddle collision check
        let paddle = this.world.getPaddle()
        if (this.isHitActor(paddle))
        {
            this.dy *= -1;
        }

        this.getWorld().iterateBricks((brick) => 
        {
            if (this.isHitActor(brick))
            {
                this.dy *= -1;
                brick.setVisibility(false);
            }
        }, true);

        // ground collision check
        if (this.y + this.radius > this.getWorld().height)
        {
            this.world.getGameMode().onBallHitGround();
        }
    }

    /**
     * @param {{width: number; height: number; x: number; y: number;}} actor 
     * @returns {boolean}
     */
    isHitActor(actor)
    {
        return this.x - this.radius > actor.x &&
                this.x + this.radius < actor.x + actor.width &&
                this.y + this.radius > actor.y &&
                this.y - this.radius < actor.y + actor.height;
    }

}


class Paddle extends Actor
{

    /**
     * @param {World} [world]
     */
    constructor(world)
    {
        super(world);
        this.x = this.getWorld().width / 2 - 40;
        this.y = this.getWorld().height - 20;
        this.width = 80;
        this.height = 10;
        this.speed = 8;
        this.dx = 0;
    }

    /**
     * tick paddle
     * @returns {void} 
     */
    tick()
    {
        this.move();
    }

    /**
     * draw paddle
     * @param {CanvasRenderingContext2D} [renderContext]
     * @returns {void} 
     */
    draw(renderContext)
    {
        renderContext.beginPath();
        renderContext.rect(this.x, this.y, this.width, this.height);
        renderContext.fillStyle = this.getWorld().getActorFillStyle(this);
        renderContext.fill();
        renderContext.closePath();
    }

    /**
     * move paddle
     * @returns {void} 
     */
    move()
    {
        this.x += this.dx;
        this.x = Math.max(Math.min(this.x, this.getWorld().width - this.width), 0);
    }

    moveLeft()
    {
        this.dx = -this.speed;
    }

    moveRight()
    {
        this.dx = this.speed;
    }

    stopMove()
    {
        this.dx = 0;
    }

}


class World
{

    /**
     * @param {number} [width]
     * @param {number} [height]
     * @param {CanvasRenderingContext2D} [context]
     */
    constructor(width, height, context)
    {
        if (World._instance)
        {
            return World._instance;
        }
        World._instance = this;
        this.width = width;
        this.height = height;
        this.canvasRenderingContext = context;
        this.actors = [];
        // game mode instance
        this.gameMode = this.spawnActor(GameMode);
        // player controller instance
        this.playerController = this.spawnActor(PlayerController);
        // player state instance
        this.playerState = this.spawnActor(PlayerState);
        // paddle instance
        this.paddle = this.spawnActor(Paddle);
        this.initializePlayerController();
        // brick config
        this.brickRowCount = 9;
        this.brickColumnCount = 5;
        // all brick instances
        this.bricks = [];
        this.initializeBricks();
        // ball instance
        this.ball = this.spawnActor(Ball);

        // call tick for the first time to start tick
        this.tick();
    }

    /**
     * tick the world, 60 fps
     * @returns {void} 
     */
    tick()
    {
        // world contains logic frame and render frame
        this.logicFrame();
        this.renderFrame();

        // requestAnimationFrame makes this function be called every frame
        // if you don't use 'bind(this)', in the next frame, 'this' will be undefined
        // the code next line also work fine
        // requestAnimationFrame(() => this.tick())
        requestAnimationFrame(this.tick.bind(this));
    }

    /**
     * logic frame of the game
     * @returns {void}
     */
    logicFrame()
    {
        for (let actor of this.actors)
        {
            actor.tick();
        }
    }

    /**
     * render frame of the game
     * @returns {void}
     */
    renderFrame()
    {
        // we should clear the canvas first
        // otherwise we can't see the ball move
        this.canvasRenderingContext.clearRect(0, 0, this.width, this.height);

        for (let actor of this.actors)
        {
            actor.draw(this.canvasRenderingContext);
        }
    }

    /**
     * spawn actor
     * @param {new (arg0: World) => Actor} actorClass
     * @returns {any}
     */
    spawnActor(actorClass)
    {
        let actor = new actorClass(this);
        this.actors.push(actor);
        return actor;
    }

    /**
     * initialize all bricks
     * @returns {void} 
     */
    initializeBricks()
    {
        if (this.bricks.length > 0)
        {
            return;
        }
        for (let i = 0; i < this.brickRowCount; i++)
        {
            this.bricks[i] = [];
            let x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
            for (let j = 0; j < this.brickColumnCount; j++)
            {
                let y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
                let brick = this.spawnActor(Brick);
                brick.x = x;
                brick.y = y;
                this.bricks[i][j] = brick;
            }
        }
    }

    /**
     * get all bricks
     * @returns {Array<Array<Brick>>}
     */
    getBricks()
    {
        return this.bricks;
    }

    /**
     * iterate all bricks
     * @param {(arg0: Brick) => void} iterationCallback
     * @param {boolean} isCheckVisible
     * @returns {void}
     */
    iterateBricks(iterationCallback, isCheckVisible=false)
    {
        if (this.bricks.length == 0)
        {
            return;
        }
        for (let brickRow of this.bricks)
        {
            for (let brick of brickRow)
            {
                if (isCheckVisible)
                {
                    if (!brick.visible)
                    {
                        continue;
                    }
                }
                iterationCallback(brick);
            }
        }
    }

    /**
     * get paddle
     * @returns {Paddle}
     */
    getPaddle()
    {
        return this.paddle;
    }

    /**
     * get game mode
     * @returns {GameMode}
     */
    getGameMode()
    {
        return this.gameMode;
    }

    /**
     * get player state
     * @returns {PlayerState}
     */
    getPlayerState()
    {
        return this.playerState;
    }

    /**
     * get player controller
     * @returns {PlayerController}
     */
    getPlayerController()
    {
        return this.playerController;
    }

    /**
     * initialize the PlayerController
     * @returns {void}
     */
    initializePlayerController()
    {
        this.playerController.setPaddle(this.paddle);
        document.addEventListener('keydown', this.playerController.onKeyDown.bind(this.playerController));
        document.addEventListener('keyup', this.playerController.onKeyUp.bind(this.playerController));
    }

    /**
     * get canvas rendering context
     * @returns {CanvasRenderingContext2D}
     */
    getCanvasRenderingContext()
    {
        return this.canvasRenderingContext;
    }

    /**
     * get actor's fill style
     * @param {Actor} actor: content on the website to be drawed
     * @returns {string}
     */
    getActorFillStyle(actor)
    {
        return actor.visible ? 'lightblue' : 'transparent';
    }

}


World._instance = null;


// the canvas html element
const drawCanvas = document.getElementById('draw-canvas');
// @ts-ignore
const context = drawCanvas.getContext('2d');
// @ts-ignore
let world = new World(drawCanvas.width, drawCanvas.height, context);
