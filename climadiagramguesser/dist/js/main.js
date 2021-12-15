"use strict";
var start_screen = document.getElementById("start-screen");
var start_button = document.getElementById("start-button");
var world_map = document.getElementById("world-map");
var world_map_img = document.getElementById("world-map-img");
var location_grid = document.getElementById("location-grid");
var pointer = document.getElementById("map-pointer");
var loc_pointer = document.getElementById("loc-pointer");
var connect_pointers = document.getElementById("connect-pointers");
var recenter_button = document.getElementById("recenter-button");
var end_game_button = document.getElementById("end-game-button");
var StartScreen = /** @class */ (function () {
    function StartScreen() {
    }
    StartScreen.remove = function () {
        start_screen.style.display = "none";
    };
    StartScreen.add = function () {
        start_screen.style.display = "";
    };
    return StartScreen;
}());
start_button === null || start_button === void 0 ? void 0 : start_button.addEventListener("click", StartScreen.remove);
var map_ratio = 1280 / 567;
var screen_ratio = world_map_img.clientWidth / world_map_img.clientHeight;
if (map_ratio < screen_ratio) {
    location_grid.style.height = "100%";
    location_grid.style.width = (100 * map_ratio) / screen_ratio + "%";
}
else {
    location_grid.style.height = (100 * screen_ratio) / map_ratio + "%";
    location_grid.style.width = "100%";
}
var WorldMap = /** @class */ (function () {
    function WorldMap() {
    }
    WorldMap.Zoom = function (e) {
        WorldMap.scale = WorldMap.scale + 1 * e.deltaY * -0.01;
        //@ts-ignore;
        if (parseInt(WorldMap.scale) < 1)
            WorldMap.scale = 1;
        //@ts-ignore;
        if (parseInt(WorldMap.scale) > 5)
            WorldMap.scale = 5;
        WorldMap.Transform();
    };
    WorldMap.Click = function (e) {
        WorldMap.init_pos = [e.clientX - WorldMap.pos[0], e.clientY - WorldMap.pos[1]];
        if (Date.now() - WorldMap.last_clicked < 200 && WorldMap.guessing) {
            pointer.style.left = e.offsetX - 3.5 + "px";
            pointer.style.top = e.offsetY - 3.5 + "px";
            pointer === null || pointer === void 0 ? void 0 : pointer.classList.remove("invisible");
            WorldMap.pointer_pos = [e.offsetX, e.offsetY];
        }
        else {
            if (e.target === world_map_img) {
                WorldMap.dragged = true;
            }
        }
        WorldMap.last_clicked = Date.now();
    };
    WorldMap.Drag = function (e) {
        if (WorldMap.dragged) {
            e.preventDefault();
            WorldMap.pos = [e.clientX - WorldMap.init_pos[0], e.clientY - WorldMap.init_pos[1]];
            WorldMap.Transform();
        }
    };
    WorldMap.MouseUp = function () {
        WorldMap.dragged = false;
    };
    WorldMap.Recenter = function () {
        WorldMap.pos = [0, 0];
        WorldMap.scale = 1;
        WorldMap.Transform();
    };
    WorldMap.Transform = function () {
        var max_width, max_height;
        if ((world_map_img === null || world_map_img === void 0 ? void 0 : world_map_img.clientWidth) && (world_map_img === null || world_map_img === void 0 ? void 0 : world_map_img.clientHeight)) {
            max_width = ((world_map_img === null || world_map_img === void 0 ? void 0 : world_map_img.clientWidth) * (WorldMap.scale - 1)) / 2;
            max_height = ((world_map_img === null || world_map_img === void 0 ? void 0 : world_map_img.clientHeight) * (WorldMap.scale - 1)) / 2;
        }
        else {
            max_width = (screen.width * (WorldMap.scale - 1)) / 2;
            max_height = (screen.height * (WorldMap.scale - 1)) / 2;
        }
        if (max_width < WorldMap.pos[0] || -max_width > WorldMap.pos[0]) {
            WorldMap.pos[0] = max_width * (WorldMap.pos[0] / Math.abs(WorldMap.pos[0]));
        }
        if (max_height < WorldMap.pos[1] || -max_height > WorldMap.pos[1]) {
            WorldMap.pos[1] = max_height * (WorldMap.pos[1] / Math.abs(WorldMap.pos[1]));
        }
        console.log("position:", WorldMap.pos, " width, height:", screen.width, screen.height, " map width, height:", world_map_img === null || world_map_img === void 0 ? void 0 : world_map_img.clientWidth, world_map_img === null || world_map_img === void 0 ? void 0 : world_map_img.clientHeight);
        world_map_img.style.transform = "scale(" + WorldMap.scale + ")";
        world_map.style.transform = "translate(" + WorldMap.pos[0] + "px, " + WorldMap.pos[1] + "px)";
    };
    WorldMap.init_pos = [0, 0];
    WorldMap.pos = [0, 0];
    WorldMap.dragged = false;
    WorldMap.last_clicked = 0;
    WorldMap.scale = 1;
    WorldMap.pointer_pos = [0];
    WorldMap.guessing = true;
    return WorldMap;
}());
world_map === null || world_map === void 0 ? void 0 : world_map.addEventListener("wheel", WorldMap.Zoom);
world_map_img === null || world_map_img === void 0 ? void 0 : world_map_img.addEventListener("mousedown", WorldMap.Click);
world_map === null || world_map === void 0 ? void 0 : world_map.addEventListener("mousemove", WorldMap.Drag);
world_map === null || world_map === void 0 ? void 0 : world_map.addEventListener("mouseup", WorldMap.MouseUp);
recenter_button === null || recenter_button === void 0 ? void 0 : recenter_button.addEventListener("mousedown", WorldMap.Recenter);
var EndGame = /** @class */ (function () {
    function EndGame() {
    }
    EndGame.Display = function () {
        loc_pointer.style.left = EndGame.loc_pos[0] - 3.5 + "px";
        loc_pointer.style.top = EndGame.loc_pos[1] - 3.5 + "px";
        loc_pointer === null || loc_pointer === void 0 ? void 0 : loc_pointer.classList.remove("invisible");
        connect_pointers.style.width = EndGame.distance + "px";
        connect_pointers.style.transform = "rotate(" + EndGame.angle + "rad)";
        connect_pointers === null || connect_pointers === void 0 ? void 0 : connect_pointers.classList.remove("invisible");
        connect_pointers.style.left = Math.abs(EndGame.connecter_loc[0]) + "px";
        connect_pointers.style.top = Math.abs(EndGame.connecter_loc[1]) + "px";
    };
    EndGame.CalcDistance = function () {
        // creates imaginary triangle (side a, b)
        var triangle_sides = [EndGame.loc_pos[0] - WorldMap.pointer_pos[0], EndGame.loc_pos[1] - WorldMap.pointer_pos[1]];
        // calcs side c (which is lenthg of connecter)
        EndGame.distance = Math.round(Math.sqrt(Math.pow(triangle_sides[0], 2) + Math.pow(triangle_sides[1], 2)));
        // calcs atan for all 4 quadrants idk how
        EndGame.angle = Math.atan2(triangle_sides[1], triangle_sides[0]);
        // finds average of both points and subtracs half of the width/height
        EndGame.connecter_loc = [
            (EndGame.loc_pos[0] + WorldMap.pointer_pos[0]) / 2 - EndGame.distance / 2,
            (EndGame.loc_pos[1] + WorldMap.pointer_pos[1]) / 2 - 0.5,
        ];
    };
    EndGame.CalcPoints = function () {
        EndGame.CalcDistance();
        EndGame.points = Math.round(5150 - (EndGame.distance / world_map_img.clientWidth) * 10000);
        if (EndGame.points < 0)
            EndGame.points = 0;
        if (EndGame.points > 5000)
            EndGame.points = 5000;
        console.log(EndGame.points);
    };
    EndGame.Click = function () {
        if (!(pointer === null || pointer === void 0 ? void 0 : pointer.classList.contains("invisible"))) {
            WorldMap.guessing = false;
            EndGame.loc_pos = [250, 190];
            WorldMap.Recenter();
            EndGame.CalcPoints();
            EndGame.Display();
        }
        else {
            alert("Double click to make a guess before ending the game!!!");
        }
    };
    EndGame.loc_pos = [0, 0];
    EndGame.distance = 0;
    EndGame.angle = 0;
    EndGame.connecter_loc = [0, 0];
    EndGame.points = 0;
    return EndGame;
}());
end_game_button === null || end_game_button === void 0 ? void 0 : end_game_button.addEventListener("click", EndGame.Click);
console.log("1280:567", 1280 / 567, world_map_img.clientWidth / world_map_img.clientHeight);
