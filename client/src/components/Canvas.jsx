import React, { useState, Component } from "react";

class DrawableCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drawing: false,
      canvasData: null,
      randomA: 0,
      randomB: 0,
      answer: 0,
      score: 0,
      randomOp: "",
    };

    this.canvasRef = React.createRef();
    this.drawingCanvas = null;
  }
  questionGenerator() {
    var randomA = 0;
    var randomB = 0;
    var answer = 0;

    randomA = Math.floor(1 + Math.random() * 9);
    const randomOperators = ["+", "-"];
    const randomOp =
      randomOperators[Math.floor(Math.random() * randomOperators.length)];

    if (randomOp === "+") {
      randomB = Math.floor(Math.random() * (10 - randomA));
      answer = randomA + randomB;
      console.log(randomOp);
    } else {
      randomB = Math.floor(Math.random() * randomA);
      answer = randomA - randomB;
      console.log(randomOp);
    }
    console.log(randomA, randomB, randomOp, answer);

    this.setState({
      randomA,
      randomB,
      randomOp,
      answer,
    });

    return { randomA, randomB, operation: randomOp, answer };
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    this.ctx = canvas.getContext("2d");
    this.ctx.lineWidth = 20;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = "white";

    this.questionGenerator();

    // Add touch event listeners
    canvas.addEventListener("touchstart", (e) => this.startPosition(e));
    canvas.addEventListener("touchend", () => this.endPosition());
    canvas.addEventListener("touchmove", (e) => this.draw(e));
  }

  startPosition(e) {
    e.preventDefault();

    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const offsetX =
      clientX - this.canvasRef.current.getBoundingClientRect().left;
    const offsetY =
      clientY - this.canvasRef.current.getBoundingClientRect().top;

    this.setState({ drawing: true });
    this.draw({ nativeEvent: { offsetX, offsetY } });
  }

  endPosition() {
    this.setState({ drawing: false });
    this.ctx.beginPath();
  }

  draw(e) {
    if (!this.state.drawing) return;

    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const offsetX =
      clientX - this.canvasRef.current.getBoundingClientRect().left;
    const offsetY =
      clientY - this.canvasRef.current.getBoundingClientRect().top;

    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX, offsetY);
  }

  resetCanvas = () => {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawingCanvas = null;
  };

  handleCanvasSubmit = () => {
    const canvas = this.canvasRef.current;

    // Create a new canvas to store only the drawing
    if (!this.drawingCanvas) {
      this.drawingCanvas = document.createElement("canvas");
      this.drawingCanvas.width = canvas.width;
      this.drawingCanvas.height = canvas.height;
    }

    const drawingCtx = this.drawingCanvas.getContext("2d");
    drawingCtx.drawImage(canvas, 0, 0);

    // Get the data URL of the drawing canvas
    const drawingCanvasData = this.drawingCanvas.toDataURL("image/png");
    console.log(drawingCanvasData);
    // Send the PNG image to your API
    this.sendImageToAPI(drawingCanvasData);
    this.resetCanvas();
  };

  sendImageToAPI = (imageData) => {
    const apiUrl = "https://mathemagics-backend-b8c1dceb57b8.herokuapp.com/"; // Replace with your API endpoint
    const formData = new FormData();
    formData.append("image_file", this.dataURLtoBlob(imageData), "drawing.png");

    fetch(apiUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((valid) => {
            console.log(valid.number, this.state.answer);
            if (valid.number === this.state.answer) {
              this.setState({
                score: this.state.score + 1,
              });
            } else {
              this.setState({
                score: this.state.score - 1,
              });
            }
            this.questionGenerator();
          });
          // You can add additional logic here after a successful upload
        } else {
          console.error(
            `Failed to upload image. Status code: ${response.status}`
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Convert data URL to Blob
  dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  render() {
    return (
      <div className="flex flex-col justify-center items-center">
        {" "}
        <div className="flex flex-row justify-center mb-20">
          <div className="font-bold text-2xl mr-7">Your Score:</div>
          <div className="font-bold text-2xl"> {this.state.score}</div>
        </div>
        <div className="font-bold text-2xl mr-7 mb-5">
          (Please draw in the area)
        </div>
        <div className="flex flex-row items-center">
          <div className="flex flex-row justify-center my-10">
            <div className=" font-bold mx-3 text-2xl ">
              {this.state.randomA}
            </div>
            <div className=" font-bold mx-3 text-2xl ">
              {this.state.randomOp}
            </div>
            <div className=" font-bold mx-3 text-2xl ">
              {this.state.randomB}
            </div>
            <div className=" font-bold mx-3 text-2xl "> = </div>
          </div>
          <canvas
            className="rounded"
            ref={this.canvasRef}
            width={150}
            height={150}
            style={{
              border: "1px solid #000",
              backgroundColor: "black",
              width: "100%", // Make the canvas 100% of the parent container
              maxWidth: "300px", // Set a maximum width to limit canvas size
            }}
            onMouseDown={(e) => this.startPosition(e)}
            onMouseUp={() => this.endPosition()}
            onMouseMove={(e) => this.draw(e)}
            onMouseOut={() => this.endPosition()}
          />
        </div>
        <button
          className="mt-10 w-30 px-10 font-bold"
          onClick={this.handleCanvasSubmit}
        >
          Check{" "}
        </button>
        {this.state.canvasData && (
          <img src={this.state.canvasData} alt="Canvas Preview" />
        )}
      </div>
    );
  }
}

export default DrawableCanvas;
