"use strict";

const snabbdom = require("snabbdom");
const patch = snabbdom.init([
  snabbdom.classModule,
  snabbdom.propsModule,
  snabbdom.styleModule,
  snabbdom.eventListenersModule,
]);

// Initialize global variables
if (typeof globalThis.data === "undefined") {
  globalThis.data = [];
}

interface ProbabilityNumber {
  digit: number;
  probability: number;
}
function ProbabilityBar({ digit, probability }: ProbabilityNumber) {
  return snabbdom.h(
    "div.group.flex.items-center.space-x-3.w-full.transition-all.duration-300.ease-in-out",
    [
      snabbdom.h(
        "div.w-8.text-center.font-semibold.text-gray-600.group-hover:text-blue-600.transition-colors",
        digit.toString(),
      ),
      snabbdom.h(
        "div.flex-1.bg-gray-200.rounded-full.h-3.overflow-hidden.shadow-inner",
        [
          snabbdom.h(
            "div.bg-gradient-to-r.from-blue-500.to-blue-700.h-full.rounded-full.transition-all.duration-500",
            {
              style: {
                width: `${probability * 100}%`,
                opacity: probability > 0 ? 1 : 0.3,
              },
            },
          ),
        ],
      ),
      snabbdom.h(
        "div.w-12.text-right.text-sm.font-medium.text-gray-700.group-hover:text-blue-700.transition-colors",
        `${(probability * 100).toFixed(1)}%`,
      ),
    ],
  );
}

// Global state to track predictions
let predictions = Array.from({ length: 10 }, (_, digit) => ({
  digit,
  probability: 0,
}));

function view() {
  return snabbdom.h(
    "div.min-h-screen.bg-gradient-to-br.from-gray-100.to-gray-200.flex.items-center.justify-center.p-6",
    [
      snabbdom.h(
        "div.bg-white.bg-opacity-80.backdrop-blur-lg.border.border-white.border-opacity-30.rounded-2xl.shadow-2xl.p-8.w-full.max-w-5xl.flex.space-x-8.transform.transition-all.duration-300.hover:scale-[1.01]",
        [
          // Drawing Area
          snabbdom.h("div.w-1/2.flex.flex-col.space-y-6", [
            snabbdom.h(
              "div.flex.items-center.justify-between.pb-2.border-b.border-gray-200",
              [
                snabbdom.h(
                  "h2.text-2xl.font-bold.text-gray-800",
                  "Digit Canvas",
                ),
                snabbdom.h(
                  "div.text-gray-500.hover:text-blue-600.transition-colors.cursor-help",
                  {
                    props: {
                      title: "Draw a single digit clearly within the canvas",
                    },
                  },
                  "ⓘ",
                ),
              ],
            ),

            // Canvas with enhanced styling
            snabbdom.h(
              "canvas#drawingCanvas.bg-white.border-2.border-gray-300.rounded-xl.shadow-md.cursor-crosshair.transition-all.duration-300.hover:shadow-lg",
              {
                props: { width: "280", height: "280" },
              },
            ),

            // Action Buttons
            snabbdom.h("div.flex.space-x-4", [
              snabbdom.h(
                "button#send.flex-1.px-6.py-3.bg-blue-600.text-white.rounded-lg.font-semibold.shadow-md.hover:bg-blue-700.focus:outline-none.focus:ring-2.focus:ring-blue-500.focus:ring-offset-2.transition-all.duration-300.transform.hover:-translate-y-0.5",
                {
                  on: { click: sendata },
                  props: { type: "button" },
                },
                "Predict Digit",
              ),
              snabbdom.h(
                "button#clear.flex-1.px-6.py-3.bg-gray-200.text-gray-700.rounded-lg.font-semibold.shadow-md.hover:bg-gray-300.focus:outline-none.focus:ring-2.focus:ring-gray-400.focus:ring-offset-2.transition-all.duration-300.transform.hover:-translate-y-0.5",
                {
                  on: { click: clearCanvas },
                  props: { type: "button" },
                },
                "Clear Canvas",
              ),
            ]),
          ]),

          // Probability Display Area
          snabbdom.h(
            "div.w-1/2.bg-gray-50.bg-opacity-50.rounded-xl.p-6.space-y-6.border.border-gray-200",
            [
              // Section Title
              snabbdom.h(
                "div.flex.items-center.justify-between.pb-2.border-b.border-gray-200",
                [
                  snabbdom.h(
                    "h2.text-2xl.font-bold.text-gray-800",
                    "Prediction Confidence",
                  ),
                  snabbdom.h(
                    "div.text-gray-500.hover:text-blue-600.transition-colors.cursor-help",
                    {
                      props: { title: "Probability of the digit prediction" },
                    },
                    "ⓘ",
                  ),
                ],
              ),

              // Probability Bars Container
              snabbdom.h(
                "div#probabilityBars.space-y-3",
                predictions.map(({ digit, probability }) =>
                  ProbabilityBar({ digit, probability }),
                ),
              ),
            ],
          ),
        ],
      ),
    ],
  );
}

function clearCanvas() {
  const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  globalThis.data = [];

  // Reset predictions
  predictions = Array.from({ length: 10 }, (_, digit) => ({
    digit,
    probability: 0,
  }));

  // Re-render the view
  const newNode = view();
  patch(oldNode, newNode);
  oldNode = newNode;
}

async function sendata() {
  try {
    const response = await fetch("/data", {
      method: "POST",
      body: JSON.stringify(globalThis.data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    const predictionData = await response.json();

    // Update predictions
    predictions = Array.from({ length: 10 }, (_, digit) => ({
      digit,
      probability: predictionData[digit] || 0,
    }));

    // Re-render the view
    const newNode = view();
    patch(oldNode, newNode);
    oldNode = newNode;
  } catch (err) {
    console.error("Prediction error:", err);
  }
}

let oldNode: HTMLElement | null;
document.addEventListener("DOMContentLoaded", function () {
  oldNode = document.getElementById("mainBody");
  const newNode = view();
  patch(oldNode, newNode);
  oldNode = newNode;
});
