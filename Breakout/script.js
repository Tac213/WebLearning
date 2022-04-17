// @ts-check

// the canvas html element
const drawCanvas = document.getElementById('draw-canvas');
// @ts-ignore
const context = drawCanvas.getContext('2d');


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


/**
 * get content's fill style
 * @param {{ visible: boolean; }} content: content on the website to be drawed
 */
function _getContentFillStyle(content)
{
    return content.visible ? 'lightblue' : 'transparent';
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
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = _getContentFillStyle(this);
        context.fill();
        context.closePath();
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
        // @ts-ignore
        this.x = drawCanvas.width / 2;
        // @ts-ignore
        this.y = drawCanvas.height / 2;
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
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = _getContentFillStyle(this);
        context.fill();
        context.closePath();
    }


    /**
     * move the ball
     */
    move()
    {
        this.x += this.dx;
        this.y += this.dy;

        // wall collision right / left
        // @ts-ignore
        if (this.x + this.radius > drawCanvas.width || this.x - this.radius < 0)
        {
            this.dx *= -1;
        }

        // wall collsion bottom / top
        // @ts-ignore
        if (this.y + this.radius > drawCanvas.height || this.y - this.radius < 0)
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
        // @ts-ignore
        if (this.y + this.radius > drawCanvas.height)
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
        // @ts-ignore
        this.x = drawCanvas.width / 2 - 40;
        // @ts-ignore
        this.y = drawCanvas.height - 20;
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
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = _getContentFillStyle(this);
        context.fill();
        context.closePath();
    }

    /**
     * move paddle
     */
    move()
    {
        this.x += this.dx;
        // @ts-ignore
        this.x = Math.max(Math.min(this.x, drawCanvas.width - this.width), 0);
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

    constructor()
    {
        if (World._instance)
        {
            return World._instance;
        }
        World._instance = this;
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
        // @ts-ignore
        context.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

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
}


World._instance = null;

let world = new World();
