class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
    }

    distance(other) {
        return Math.sqrt(this.distanceSquared(other));
    }

    distanceSquared(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return dx * dx + dy * dy;
    }
}

class Point {
    constructor(position, velocity, color) {
        this.position = position;
        this.velocity = velocity;
        this.color = color;
    }
}

const interval = 30;
const radius = 4;
const lineWidth = 3;
const maxDistance = 120;
const maxSpeed = 25;
const points = []

onresize = () => {
    const canvas = document.getElementById("background");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw();
}

function init() {
    const canvas = document.getElementById("background");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const amount = canvas.width * canvas.height / 15000;

    for (let i = 0; i < amount; i++) {
        points.push(new Point(
            new Vector(Math.random() * canvas.width, Math.random() * canvas.height),
            new Vector(
                (Math.random() * 2 - 1) * interval / 1000 * maxSpeed,
                (Math.random() * 2 - 1) * interval / 1000 * maxSpeed),
            'hsl(' + 360 * Math.random() + ',30%,40%)'
        ));
    }

    draw();

    setInterval(() => {
        update();
        draw();
    }, interval);

    const quote = document.getElementById("quote");
    const quotes = JSON.parse(quote.dataset.quotes);

    quote.innerText = quotes[Math.floor(Math.random() * quotes.length)];

    setInterval(() => {
        quote.innerText = quotes[Math.floor(Math.random() * quotes.length)];
    }, 10 * 1000);
}

function update() {
    const canvas = document.getElementById("background");
    const width = canvas.width;
    const height = canvas.height;

    for (const point of points) {
        point.position.add(point.velocity);

        if (point.position.x < 0 || point.position.x >= width) {
            point.velocity.x *= -1;
            point.position.x = Math.min(Math.max(point.position.x, 0), width);
        }
        if (point.position.y < 0 || point.position.y >= height) {
            point.velocity.y *= -1;
            point.position.y = Math.min(Math.max(point.position.y, 0), height);
        }
    }
}

function draw() {
    const canvas = document.getElementById("background");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < i; j++) {
            const from = points[i];
            const to = points[j];

            if (from.position.distanceSquared(to.position) > maxDistance * maxDistance)
                continue;

            const relative = (maxDistance - from.position.distance(to.position)) / maxDistance;
            // ctx.globalAlpha = relative;
            ctx.lineWidth = lineWidth * relative;

            const gradient = ctx.createLinearGradient(from.position.x, from.position.y, to.position.x, to.position.y);
            gradient.addColorStop(0, from.color);
            gradient.addColorStop(1, to.color);

            ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(from.position.x, from.position.y);
            ctx.lineTo(to.position.x, to.position.y);
            ctx.stroke();
        }
    }

    // ctx.globalAlpha = 1;
    for (const point of points) {
        ctx.beginPath();

        ctx.fillStyle = point.color;
        ctx.arc(point.position.x, point.position.y, radius, 0, Math.PI * 2, true);
        ctx.fill();
    }
}