const canvas = document.getElementById("canvas");
canvas.width = canvas.parentElement.clientWidth;
canvas.height = 600;

let context = canvas.getContext("2d");
let start_background_color = "white";
context.fillStyle = start_background_color;
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width = 2;
let is_drawing = false;
let is_erasing = false;
let is_stamping = false;
let current_stamp = "★";

let restore_array = [];
let index = -1;

function change_color(element) {
    draw_color = element.style.background;
    if (is_erasing) {
        is_erasing = false;
        set_active(document.querySelector(".tools .button"));
    }
}

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

function start(event) {
    if (is_stamping) {
        context.fillStyle = draw_color;
        context.font = (draw_width * 2 + 15) + "px sans-serif";
        context.textAling = "center";
        context.textBaseLine = "middle";
        context.fillText(current_stamp, event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop)
    } else {
        is_drawing = true;
        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }
    event.preventDefault();
}

function draw(event) {
    if(is_drawing) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.strokeStyle = is_erasing ? start_background_color : draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }
    event.preventDefault();
}

function stop(event) {
    if(is_drawing) {
        context.stroke();
        context.closePath();
        is_drawing = false;
    }
    event.preventDefault();

    if (event.type != 'mouseout') {
        restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
}

function clear_canvas() {
    context.fillStyle = start_background_color;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    restore_array = [];
    index = -1;
}

function undo_last() {
    if(index <= 0) {
        clear_canvas();
    } else {
        index -= 1;
        restore_array.pop();
        context.putImageData(restore_array[index], 0, 0);
    }
}

function set_active(element) {
    document.querySelectorAll(".button, .stamp_icon").forEach(el => {
        el.classList.remove("active");
    });
    element.classList.add("active");
}

function set_draw(element) {
    is_erasing = false;
    is_stamping = false;
    set_active(element);
}


function eraser(element) {
    is_erasing = true;
    is_stamping = false;
    set_active(element);
}

function stamp_star(element) {
    is_erasing = false;
    is_stamping = true;
    current_stamp = "★";
    set_active(element);
}

function stamp_flower(element) {
    is_erasing = false;
    is_stamping = true;
    current_stamp = "✿";
    set_active(element);
}

function stamp_snow(element){
    is_erasing = false;
    is_stamping = true;
    current_stamp = "❄";
    set_active(element);
}

function stamp_cloud(element){
    is_erasing = false;
    is_stamping = true;
    current_stamp = "☁";
    set_active(element);
}