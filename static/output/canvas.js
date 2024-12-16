/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./static/input/canvas.ts":
/*!********************************!*\
  !*** ./static/input/canvas.ts ***!
  \********************************/
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var canvas;
var CanvasManager;
if (typeof globalThis.data === "undefined") {
    globalThis.data = [];
}
var DrawManager = /** @class */ (function () {
    function DrawManager(canvasEl) {
        this.canvasEl = canvasEl;
        this.context = canvasEl.getContext("2d");
        this.isDrawing = false;
        this.width = this.canvasEl.width;
        this.height = this.canvasEl.height;
        this.lastDraw = Date.now();
        this.relPos = [];
        if (this.context !== null) {
            this.context.fillStyle = "black";
            this.context.fillRect(0, 0, this.width, this.height);
        }
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDrag = this.onMouseDrag.bind(this);
        this.computeRelPos = this.computeRelPos.bind(this);
        this.update = this.update.bind(this);
        this.singlePath = this.singlePath.bind(this);
        this.addlisteners = this.addlisteners.bind(this);
        this.addlisteners();
    }
    DrawManager.prototype.addlisteners = function () {
        this.canvasEl.addEventListener("mousedown", this.onMouseDown);
        this.canvasEl.addEventListener("mouseup", this.onMouseUp);
        this.canvasEl.addEventListener("mouseleave", this.onMouseUp);
        this.canvasEl.addEventListener("mousemove", this.onMouseDrag);
    };
    DrawManager.prototype.computeRelPos = function (ev) {
        var bb = this.canvasEl.getBoundingClientRect();
        var scaleX = this.canvasEl.width / bb.width;
        var scaleY = this.canvasEl.height / bb.height;
        var xPos = ev.clientX;
        var yPos = ev.clientY;
        this.relPos = [(xPos - bb.left) * scaleX, (yPos - bb.top) * scaleY];
        return this.relPos;
    };
    DrawManager.prototype.onMouseDown = function (ev) {
        this.isDrawing = true;
        var relPos = this.computeRelPos(ev);
        data.push([[relPos[0], relPos[1]]]);
    };
    DrawManager.prototype.onMouseUp = function (ev) {
        this.isDrawing = false;
        //senddata();
    };
    DrawManager.prototype.onMouseDrag = function (ev) {
        if (this.isDrawing) {
            var relPos = this.computeRelPos(ev);
            data[data.length - 1].push([relPos[0], relPos[1]]);
            this.update();
        }
    };
    DrawManager.prototype.update = function () {
        if (!this.context)
            return;
        this.context.beginPath();
        this.context.strokeStyle = "white";
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var path = data_1[_i];
            this.singlePath(path);
        }
    };
    DrawManager.prototype.singlePath = function (path) {
        var _a, _b;
        if (!this.context)
            return;
        this.context.lineWidth = 10;
        for (var i = 0; i < path.length - 1; i++) {
            var current_coord = path[i];
            var next_coord = path[i + 1];
            (_a = this.context) === null || _a === void 0 ? void 0 : _a.moveTo(current_coord[0], current_coord[1]);
            (_b = this.context) === null || _b === void 0 ? void 0 : _b.lineTo(next_coord[0], next_coord[1]);
            this.context.stroke();
        }
    };
    return DrawManager;
}());
function senddata() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            fetch("/data", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8" },
            })
                .then(function (response) { return response.json(); })
                .then(function (json) { return console.log(json); })
                .catch(function (err) { return console.log(err); });
            return [2 /*return*/];
        });
    });
}
document.addEventListener("DOMContentLoaded", function () {
    canvas = document.getElementById("drawingCanvas");
    CanvasManager = new DrawManager(canvas);
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./static/input/canvas.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=canvas.js.map