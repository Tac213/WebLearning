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
     */
    tick() {}

    /**
     * draw the actor
     */
    draw() {}

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
     */
    setVisibility(isVisible)
    {
        this.visible = isVisible;
    }

}


class GameMode extends Actor
{
    onBallHitGround()
    {
        for (let brickRow of this.world.getBricks())
        {
            for (let brick of brickRow)
            {
                brick.setVisibility(true);
            }
        }
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
     */
    setPaddle(paddle)
    {
        this.paddle = paddle;
    }

    /**
     * will be called when key down
     * @param {KeyboardEvent} event
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
     * tick the brick
     */
    tick()
    {
        this.draw();
    }

    /**
     * draw brick
     */
    draw()
    {
        this.getWorld().getCanvasRenderingContext().beginPath();
        this.getWorld().getCanvasRenderingContext().rect(this.x, this.y, this.width, this.height);
        this.getWorld().getCanvasRenderingContext().fillStyle = this.getWorld().getActorFillStyle(this);
        this.getWorld().getCanvasRenderingContext().fill();
        this.getWorld().getCanvasRenderingContext().closePath();
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
     */
    tick()
    {
        this.move();
        this.draw();
    }

    /**
     * draw ball
     */
    draw()
    {
        this.getWorld().getCanvasRenderingContext().beginPath();
        this.getWorld().getCanvasRenderingContext().arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.getWorld().getCanvasRenderingContext().fillStyle = this.getWorld().getActorFillStyle(this);
        this.getWorld().getCanvasRenderingContext().fill();
        this.getWorld().getCanvasRenderingContext().closePath();
    }


    /**
     * move the ball
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

        for (let brickRow of this.world.getBricks())
        {
            for (let brick of brickRow)
            {
                if (!brick.visible)
                {
                    continue;
                }
                if (this.isHitActor(brick))
                {
                    this.dy *= -1;
                    brick.setVisibility(false);
                }
            }
        }

        // ground collision check
        if (this.y + this.radius > this.getWorld().height)
        {
            this.world.getGameMode().onBallHitGround();
        }
    }

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
     */
    tick()
    {
        this.move();
        this.draw();
    }

    /**
     * draw paddle
     */
    draw()
    {
        this.getWorld().getCanvasRenderingContext().beginPath();
        this.getWorld().getCanvasRenderingContext().rect(this.x, this.y, this.width, this.height);
        this.getWorld().getCanvasRenderingContext().fillStyle = this.getWorld().getActorFillStyle(this);
        this.getWorld().getCanvasRenderingContext().fill();
        this.getWorld().getCanvasRenderingContext().closePath();
    }

    /**
     * move paddle
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
        this.gameMode = new GameMode(this);
        // player controller instance
        this.playerController = new PlayerController();
        // paddle instance
        this.paddle = new Paddle(this);
        this.initializePlayerController();
        // brick config
        this.brickRowCount = 9;
        this.brickColumnCount = 5;
        // all brick instances
        this.bricks = [];
        this.initializeBricks();
        // ball instance
        this.ball = new Ball(this);

        // call tick for the first time
        this.tick();
    }

    /**
     * tick the world, 60 fps
     */
    tick()
    {
        // we should clear the canvas first
        // otherwise we can't see the ball move
        this.canvasRenderingContext.clearRect(0, 0, this.width, this.height);

        this.ball.tick();
        this.paddle.tick();
        for (let brickRow of this.bricks)
        {
            for (let brick of brickRow)
            {
                brick.tick();
            }
        }

        // requestAnimationFrame makes this function be called every frame
        // if you don't use 'bind(this)', in the next frame, 'this' will be undefined
        // the code next line also work fine
        // requestAnimationFrame(() => this.tick())
        requestAnimationFrame(this.tick.bind(this));
    }

    /**
     * initialize all bricks
     * @returns 
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
                let brick = new Brick(this);
                brick.x = x;
                brick.y = y;
                this.bricks[i][j] = brick;
            }
        }
    }

    /**
     * get all bricks
     * @returns array
     */
    getBricks()
    {
        return this.bricks;
    }

    /**
     * iterate all bricks
     * @param {(arg0: Brick) => void} iterationCallback
     * @param {boolean} isCheckVisible
     */
    iterateBricks(iterationCallback, isCheckVisible)
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
     */
    getPaddle()
    {
        return this.paddle;
    }

    /**
     * get game mode
     */
    getGameMode()
    {
        return this.gameMode;
    }

    /**
     * initialize the PlayerController
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
