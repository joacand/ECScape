import Configuration from '../core/configuration.js';

export class IComponent { }

export class AffectedByGravity extends IComponent {
    constructor(gravity = Configuration.DefaultGravity) {
        super();
        this.Gravity = gravity;
    }
}

export class Collectable extends IComponent {
    constructor(collectInterval = 1000, scoreAmount = 1) {
        super();
        this.CollectInterval = collectInterval;
        this.ScoreAmount = scoreAmount;
    }
}

export class DamagesPlayer extends IComponent {
    constructor(damageAmount, damageInterval = 1000) {
        super();
        this.DamageAmount = damageAmount;
        this.DamageInterval = damageInterval;
    }
}

export class Drawable extends IComponent {
    constructor(symbol, color = 'white', sprite = null, tileable = true) {
        super();
        this.Symbol = symbol;
        this.Color = color;
        this.Sprite = sprite;
        this.SpriteWidth = sprite ? sprite.width : null;
        this.SpriteHeight = sprite ? sprite.height : null;
        this.Tileable = tileable;
    }
}

export class Exists extends IComponent { }

export class Health extends IComponent {
    constructor(hearts = 3) {
        super();
        this.Hearts = hearts;
    }
}

export class Invulnerable extends IComponent {
    constructor(expirationTime) {
        super();
        this.ExpirationTime = expirationTime;
    }
}

export class LimitedByBounds extends IComponent { }

export class Npc extends IComponent { }

export class PlayerControllable extends IComponent { }

export class Position extends IComponent {
    constructor(left, top) {
        super();
        this.Left = left;
        this.Top = top;
        this.Direction = "r";
    }

    get LeftInt() { return Math.floor(this.Left); }
    get TopInt() { return Math.floor(this.Top); }
}

export class PowerUpHealth extends IComponent { }

export class Size extends IComponent {
    constructor(width, height) {
        if (!width) { width = 10; }
        if (!height) { height = 10; }
        super();
        this.Width = width;
        this.Height = height;
        this.OriginalWidth = width;
        this.OriginalHeight = height;
    }
}

export class Solid extends IComponent { }

export class Statistics extends IComponent {
    constructor(score = 0) {
        super();
        this.Score = score;
    }
}

export class Velocity extends IComponent {
    constructor(x = 0, y = 0) {
        super();
        this.X = x;
        this.Y = y;
    }
}
