

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i) {
    return(<Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>);
  }

  render() {
   
    var rows = [];
    let squares = [];
    for (var row=0; row<3; row++) {
      for (var index=row*3; index<row*3+3; index++) {
        
        let winning = false;
        const winningLine = this.props.winningLine;
        if (winningLine) {
          for (var i=0; i<winningLine.length; i++) {
            if (winningLine[i] == index)
              winning = true;
          }
        }
        
        squares.push(this.renderSquare(index, winning));
      }    
      rows.push(<div key={row} className="board-row">{squares}</div>);
      squares = [];
    }
    
    return <div> {rows} </div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),

        }
      ],
      stepNumber: 0,
      xIsNext: true,
      val: [],
      up: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let val=this.state.val;
    val[history.length] = defineLocation(i);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      val: val
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber : step,
      xIsNext : (step%2)===0,
    });
  }

  up(){
    if(this.state.up === true){
      return;
    }
    this.setState({
      up: true
    });
  }

  down(){
    if(this.state.up === false){
      return;
    }
    this.setState({
      up: false
    });
  }

  render() {

  const history = this.state.history;
  const current = history[this.state.stepNumber];
  const winner = calculateWinner(current.squares);
  const location = this.state.val;
  let moves = history.map((step, move) => {
    const desc = move ?
        'Go to move #' + move + " " + location[move] :
        'Go to game start';
    if(move===this.state.stepNumber){
       return (
        <li key={move}>
          <button className="zarif" onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
       );
    }else{ 
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    }
  });

  const up = this.state.up;
  if(up === false){
    moves.reverse();
  }

  let status;
  if (winner) {
    status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
    console.log(current.squares[winner[1]]);
    winner.forEach(function(item, i, arr) {
      current.squares[item] = <span className="winner">{current.squares[item]}</span>
    });
  }else if(this.state.history.length === 10){
    status = "Draw";
  }else {
    status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.up()}>Up</button>
            <button onClick={() => this.down()}>Down</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function defineLocation(i){
  let location;
  if(i === 0 || i === 1 || i === 2){
    location = "row=1" 
  }
  if(i === 3 || i === 4 || i === 5){
    location = "row=2" 
  }
  if(i === 6 || i === 7 || i === 8){
    location = "row=3" 
  }
  if(i === 0 || i === 3 || i === 6){
    location = location +" col=1" 
  }
  if(i === 1 || i === 4 || i === 7){
    location = location +" col=2" 
  }
   if(i === 2 || i === 5 || i === 8){
    location = location +" col=3" 
  }
  return location
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
    if(squares[a] instanceof Object){
      return [a, b, c];
    }
  }
  return null;
}