from quart import render_template, Quart, request
from reshape import mnist_preprocess
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
import pprint
from neuralnet import classify


app = Quart(__name__)
app.config["template_folder"] = "templates"
app.config["static_folder"] = "static"


@app.get("/")
async def home():
    return await render_template("index.html")


@app.post("/data")
async def data():
    data = await request.get_json()
    arr=mnist_preprocess(data)
    output = classify(arr)
    predictions = {}
    for i in range(10):
        predictions[i] = output[i]
    return predictions


async def createPixelOutput():
    pass


if __name__ == "__main__":
    app.run(debug=True)
