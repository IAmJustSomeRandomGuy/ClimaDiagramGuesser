type elementByID = HTMLElement | null;

let start_screen = document.getElementById("start-screen");
let start_button = document.getElementById("start-button");

let world_map = document.getElementById("world-map");
let world_map_img = document.getElementById("world-map-img");
let location_grid = document.getElementById("location-grid");

let pointer = document.getElementById("map-pointer");
let loc_pointer = document.getElementById("loc-pointer");
let connect_pointers = document.getElementById("connect-pointers");

let recenter_button = document.getElementById("recenter-button");
let end_game_button = document.getElementById("end-game-button");

class StartScreen {
	static remove() {
		start_screen!.style.display = "none";
	}
	static add() {
		start_screen!.style.display = "";
	}
}

start_button?.addEventListener("click", StartScreen.remove);

let map_ratio = 1280 / 567;
let screen_ratio = world_map_img!.clientWidth / world_map_img!.clientHeight;

if (map_ratio < screen_ratio) {
	location_grid!.style.height = "100%";
	location_grid!.style.width = (100 * map_ratio) / screen_ratio + "%";
} else {
	location_grid!.style.height = (100 * screen_ratio) / map_ratio + "%";
	location_grid!.style.width = "100%";
}

class WorldMap {
	static init_pos = [0, 0];
	static pos = [0, 0];
	static dragged = false;
	static last_clicked = 0;
	static scale = 1;
	static pointer_pos = [0];
	static guessing = true;

	static Zoom(e: WheelEvent) {
		WorldMap.scale = WorldMap.scale + 1 * e.deltaY * -0.01;

		//@ts-ignore;
		if (parseInt(WorldMap.scale) < 1) WorldMap.scale = 1;
		//@ts-ignore;
		if (parseInt(WorldMap.scale) > 5) WorldMap.scale = 5;

		WorldMap.Transform();
	}

	static Click(e: MouseEvent) {
		WorldMap.init_pos = [e.clientX - WorldMap.pos[0], e.clientY - WorldMap.pos[1]];

		if (Date.now() - WorldMap.last_clicked < 200 && WorldMap.guessing) {
			pointer!.style.left = e.offsetX - 3.5 + "px";
			pointer!.style.top = e.offsetY - 3.5 + "px";
			pointer?.classList.remove("invisible");

			WorldMap.pointer_pos = [e.offsetX, e.offsetY];
		} else {
			if (e.target === world_map_img) {
				WorldMap.dragged = true;
			}
		}
		WorldMap.last_clicked = Date.now();
	}
	static Drag(e: MouseEvent) {
		if (WorldMap.dragged) {
			e.preventDefault();

			WorldMap.pos = [e.clientX - WorldMap.init_pos[0], e.clientY - WorldMap.init_pos[1]];

			WorldMap.Transform();
		}
	}
	static MouseUp() {
		WorldMap.dragged = false;
	}

	static Recenter() {
		WorldMap.pos = [0, 0];
		WorldMap.scale = 1;
		WorldMap.Transform();
	}

	static Transform() {
		let max_width, max_height;
		if (world_map_img?.clientWidth && world_map_img?.clientHeight) {
			max_width = (world_map_img?.clientWidth * (WorldMap.scale - 1)) / 2;
			max_height = (world_map_img?.clientHeight * (WorldMap.scale - 1)) / 2;
		} else {
			max_width = (screen.width * (WorldMap.scale - 1)) / 2;
			max_height = (screen.height * (WorldMap.scale - 1)) / 2;
		}

		if (max_width < WorldMap.pos[0] || -max_width > WorldMap.pos[0]) {
			WorldMap.pos[0] = max_width * (WorldMap.pos[0] / Math.abs(WorldMap.pos[0]));
		}
		if (max_height < WorldMap.pos[1] || -max_height > WorldMap.pos[1]) {
			WorldMap.pos[1] = max_height * (WorldMap.pos[1] / Math.abs(WorldMap.pos[1]));
		}
		console.log(
			"position:",
			WorldMap.pos,
			" width, height:",
			screen.width,
			screen.height,
			" map width, height:",
			world_map_img?.clientWidth,
			world_map_img?.clientHeight
		);

		world_map_img!.style.transform = "scale(" + WorldMap.scale + ")";
		world_map!.style.transform = "translate(" + WorldMap.pos[0] + "px, " + WorldMap.pos[1] + "px)";
	}
}

world_map?.addEventListener("wheel", WorldMap.Zoom);

world_map_img?.addEventListener("mousedown", WorldMap.Click);
world_map?.addEventListener("mousemove", WorldMap.Drag);
world_map?.addEventListener("mouseup", WorldMap.MouseUp);

recenter_button?.addEventListener("mousedown", WorldMap.Recenter);

class EndGame {
	static loc_pos = [0, 0];
	static distance = 0;
	static angle = 0;
	static connecter_loc = [0, 0];
	static points = 0;

	static Display() {
		loc_pointer!.style.left = EndGame.loc_pos[0] - 3.5 + "px";
		loc_pointer!.style.top = EndGame.loc_pos[1] - 3.5 + "px";
		loc_pointer?.classList.remove("invisible");

		connect_pointers!.style.width = EndGame.distance + "px";
		connect_pointers!.style.transform = "rotate(" + EndGame.angle + "rad)";
		connect_pointers?.classList.remove("invisible");

		connect_pointers!.style.left = Math.abs(EndGame.connecter_loc[0]) + "px";
		connect_pointers!.style.top = Math.abs(EndGame.connecter_loc[1]) + "px";
	}

	static CalcDistance() {
		// creates imaginary triangle (side a, b)
		let triangle_sides = [EndGame.loc_pos[0] - WorldMap.pointer_pos[0], EndGame.loc_pos[1] - WorldMap.pointer_pos[1]];
		// calcs side c (which is lenthg of connecter)
		EndGame.distance = Math.round(Math.sqrt(triangle_sides[0] ** 2 + triangle_sides[1] ** 2));
		// calcs atan for all 4 quadrants idk how
		EndGame.angle = Math.atan2(triangle_sides[1], triangle_sides[0]);
		// finds average of both points and subtracs half of the width/height
		EndGame.connecter_loc = [
			(EndGame.loc_pos[0] + WorldMap.pointer_pos[0]) / 2 - EndGame.distance / 2,
			(EndGame.loc_pos[1] + WorldMap.pointer_pos[1]) / 2 - 0.5,
		];
	}

	static CalcPoints() {
		EndGame.CalcDistance();

		EndGame.points = Math.round(5150 - (EndGame.distance / world_map_img!.clientWidth) * 10000);
		if (EndGame.points < 0) EndGame.points = 0;
		if (EndGame.points > 5000) EndGame.points = 5000;

		console.log(EndGame.points);
	}

	static Click() {
		if (!pointer?.classList.contains("invisible")) {
			WorldMap.guessing = false;

			EndGame.loc_pos = [250, 190];
			WorldMap.Recenter();
			EndGame.CalcPoints();
			EndGame.Display();
		} else {
			alert("Double click to make a guess before ending the game!!!");
		}
	}
}

end_game_button?.addEventListener("click", EndGame.Click);

console.log("1280:567", 1280 / 567, world_map_img!.clientWidth / world_map_img!.clientHeight);
