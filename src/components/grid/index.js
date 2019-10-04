import React, { Component } from "react";
import { Row, Col, Button, Modal } from "antd";
import "antd/dist/antd.css";
import "./index.scss";
import Square from "../square";

const colorArray = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF"
];

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagArray: new Array(64).fill(false)
    };
  }

  componentWillMount() {
    let flatArray = [...Array(32).keys()];
    let newArray = flatArray.concat(flatArray);
    let randomizedArray = this.shuffle(newArray);
    this.setState({ randomizedArray: randomizedArray });
    let colorShuffle = this.shuffle(flatArray);
    colorShuffle = colorShuffle.concat(colorShuffle);
    this.randomizedArray = randomizedArray;
    this.colorShuffle = colorShuffle;
    this.attempt = 0;
    this.sucess = 0;
    this.fail = 0;
    // console.log(this.randomizedArray)
  }

  shuffle = array => {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  handleClick = cell => {
    // console.log('click start: ',this.attempt);
    this.attempt++;
    // console.log('click end: ',this.attempt);
    if (this.state.flagArray[cell]) {
      return;
    }
    if (this.state.isDoubleClicked) {
      if (
        cell !== this.state.doubleClicked &&
        this.randomizedArray[this.state.doubleClicked] ===
          this.randomizedArray[cell]
      ) {
        let newArray = this.state.flagArray;
        newArray[cell] = true;
        newArray[this.state.doubleClicked] = true;
        this.sucess++;
        this.setState({
          flagArray: newArray,
          isDoubleClicked: false,
          clickedCell: null
        });
        if (this.sucess === 32) {
          this.setState({ finished: true });
        }
        return;
      } else {
        this.fail++;
      }
    }

    this.setState({ clickedCell: cell, isDoubleClicked: false });
  };

  handleDoubleClick = cell => {
    // console.log('double start: ',this.attempt);
    this.attempt--;
    // console.log('double end: ',this.attempt)
    if (this.state.flagArray[cell]) {
      return;
    }
    this.setState({ doubleClicked: cell, isDoubleClicked: true });
  };

  renderGrid = () => {
    // console.log("executed")
    let row = [],
      grid = [],
      randomColor,
      cell;
    for (let i = 0; i < 8; i++) {
      row = [];
      for (let j = 0; j < 8; j++) {
        // randomColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        cell = i * 8 + j;
        randomColor = colorArray[this.colorShuffle[i * 8 + j]];
        row.push(
          <Col
            className="grid__column"
            align="center"
            style={{ padding: 0, margin: 0, cursor: "pointer" }}
            span={3}
            onClick={() => {
              this.handleClick(i * 8 + j);
            }}
            onDoubleClick={() => {
              this.handleDoubleClick(i * 8 + j);
            }}
          >
            <Square
              backgroundColor={
                this.state.clickedCell === cell || this.state.flagArray[cell]
                  ? "#362b35"
                  : randomColor
              }
              value={
                (this.state.clickedCell === cell ||
                  this.state.flagArray[cell]) &&
                this.randomizedArray[cell]
              }
            />
          </Col>
        );
      }
      grid.push(<Row gutter={24}>{row}</Row>);
    }
    return grid;
  };

  reload = () => {
    let flatArray = [...Array(32).keys()];
    let newArray = flatArray.concat(flatArray);
    let randomizedArray = this.shuffle(newArray);
    let colorShuffle = this.shuffle(flatArray);
    colorShuffle = colorShuffle.concat(colorShuffle);
    this.randomizedArray = randomizedArray;
    this.colorShuffle = colorShuffle;
    this.attempt = 0;
    this.sucess = 0;
    this.fail = 0;
    this.setState({
      finished: false,
      randomizedArray: randomizedArray,
      clickedCell: null,
      doubleClicked: null,
      isDoubleClicked: false,
      flagArray: new Array(64).fill(false)
    });
  };

  render() {
    return (
      <div>
        <Row className="statusText">
          <Col span={8} align="center">
            Success: {this.sucess}
          </Col>
          <Col span={8} align="center">
            Inspect: {this.attempt}
          </Col>
          <Col span={8} align="center">
            Fail: {this.fail}
          </Col>
        </Row>
        <div className="grid">{this.renderGrid()}</div>
        <Modal
          visible={this.state.finished}
          onOk={this.reload}
          onCancel={() => {
            this.setState({ finished: false });
          }}
        >
          Game Completed, want to reset?
        </Modal>
      </div>
    );
  }
}

export default Grid;
