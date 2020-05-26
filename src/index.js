import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, ButtonGroup, Container, Dropdown, DropdownButton, Row } from 'react-bootstrap';

import './index.css';
import './bootstrap.min.css';
import Grid from './components/grid';

class Main extends Component {

  constructor() {
    super();
    this.intervalDefault = 300;
		this.rowsDefault = 30;
		this.colsDefault = 50;
    this.state = {
      interval: this.intervalDefault,
      generation: 0,
      playing: false,
      gridPosta: arrayInit(this.rowsDefault, this.colsDefault),
      rows: this.rowsDefault,
      cols: this.colsDefault
    }
  }

  onClickCell = (row, col) => {
    //cuando el usuario hace click lo que hago es asignar el estado opuesto
    //cada vez que manipulo la grilla no me queda opcion que crear una temporal
    this.pause();
    let gridTemp = arrayClone(this.state.gridPosta);
    gridTemp[row][col] = !gridTemp[row][col];
    this.setState({
      gridPosta: gridTemp
    })
  }
  
  randomLoad = () => {
    let gridTemp = arrayClone(this.state.gridPosta);
    for (let i = 0; i < this.state.rows; i++) {
      for (let j = 0; j < this.state.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridTemp[i][j] = true;
        }
      }
    }
    this.setState({
      gridPosta: gridTemp
    })
  }

  //boton iniciar, le doy play cada cierto intervalo
  nextStep = () => {
    this.setState({
      playing: true
    });
    this.intervalId = setInterval(this.play, this.state.interval);
  }

  //para la ejecucion paso a paso solo le doy play una sola vez
  stepByStep = () => {
    this.play();
    this.setState({
      playing: false
    });
  }

  //limpio el interval id para que deje de avanzar
  pause = () => {
    clearInterval(this.intervalId);
    this.setState({
      playing: false
    });
  }

  //vuelvo a valores iniciales
	reset = () => {
    clearInterval(this.intervalId);
    let gridTemp = arrayInit(this.state.rows, this.state.cols);
		this.setState({
			gridPosta: gridTemp,
      generation: 0,
      playing: false
		});
	}

  //logica principal
  play = () => {
    //creo dos grillas, una para ir comparando, g2 es la que va a ser la nueva grilla del siguiente turno
    let g = this.state.gridPosta;
    let g2 = arrayClone(this.state.gridPosta);
    let rows = this.state.rows;
    let cols = this.state.cols;

    //cuento vecinas vivas para cada celula 
    for (let i = 0; i < rows; i++) {
		  for (let j = 0; j < cols; j++) {
		    let neighborAlive = 0;
		    if (i > 0) if (g[i - 1][j]) neighborAlive++; //chequeo arriba
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) neighborAlive++; //chequeo arriba izq
		    if (i > 0 && j < cols - 1) if (g[i - 1][j + 1]) neighborAlive++; //chequeo arriba der
		    if (j < cols - 1) if (g[i][j + 1]) neighborAlive++; //chequeo der
		    if (j > 0) if (g[i][j - 1]) neighborAlive++; //chequeo izq
		    if (i < rows - 1) if (g[i + 1][j]) neighborAlive++; //chequeo abajo
		    if (i < rows - 1 && j > 0) if (g[i + 1][j - 1]) neighborAlive++; //chequeo abajo izq
        if (i < rows - 1 && j < cols - 1) if (g[i + 1][j + 1]) neighborAlive++; //chequeo abajo der

        if (j === 0) if (g[i][cols - 1]) neighborAlive++; //chequeo ext izq
        if (j === 0 && i > 0) if (g[i - 1][cols - 1]) neighborAlive++; //chequeo ext izq arriba
        if (j === 0 && i < rows - 1) if (g[i + 1][cols - 1]) neighborAlive++; //chequeo ext izq abajo

        if (j === (cols - 1)) if (g[i][0]) neighborAlive++; // chequeo ext der
        if (i > 0 && j === (cols - 1)) if (g[i - 1][0]) neighborAlive++; //chequeo ext der arriba
        if (i < (rows - 1) && j === (cols - 1)) if (g[i + 1][0]) neighborAlive++; //chequeo ext der abajo

        if (i === 0) if (g[rows - 1][j]) neighborAlive++; //chequeo ext arriba
        if (i === 0 && j > 0) if (g[rows - 1][j - 1]) neighborAlive++; //chequeo ext arriba izq
        if (i === 0 && j < cols - 1) if (g[rows - 1][j + 1]) neighborAlive++; //chequeo ext arriba der

        if (i === (rows - 1)) if (g[0][j]) neighborAlive++; //chequeo ext abajo
        if (i === (rows - 1) && j > 0) if (g[0][j - 1]) neighborAlive++; //chequeo ext abajo izq
        if (i === (rows - 1) && j < rows - 1) if (g[0][j + 1]) neighborAlive++; //chequeo ext abajo der

        if (i === 0 && j === 0) if (g[rows - 1][cols - 1]) neighborAlive ++; // chequeo ext (0,0)
        if (i === 0 && j === cols - 1) if (g[rows - 1][0]) neighborAlive ++; // chequeo ext (0,n)
        if (i === rows - 1 && j === 0) if (g[0][cols - 1]) neighborAlive ++; // chequeo ext (n,0)
        if (i === rows - 1 && j === cols - 1) if (g[0][0]) neighborAlive ++; // chequeo ext (n,n)

        //Una célula muerta con exactamente 3 células vivas vecinas, “nace”
        if (!g[i][j] && neighborAlive === 3) g2[i][j] = true;
        //Una célula viva con menos de 2 células vecinas vivas muere de “soledad”
        if (g[i][j] && neighborAlive < 2) g2[i][j] = false;
        //Una célula viva con más de 3 células vecinas vivas muere por “sobrepoblación”
        if (g[i][j] && neighborAlive > 3) g2[i][j] = false;
		  }
    }
    
    //seteo la g2 como la nueva grilla para el siguiente turno
		this.setState({
		  gridPosta: g2,
		  generation: this.state.generation + 1
		});
  }

  //opcion seleccionada de nuevo tamaño
  changeSelect = (opt) => {
    switch (opt) {
			case "1":
				this.changeSize(20, 40);
		  	break;
			case "2":
				this.changeSize(30, 50);
		  	break;
			default:
				this.changeSize(40, 60);
		}
  }

  //cambio tamaño segun parametro
  changeSize = (rows, cols) => {
    clearInterval(this.intervalId);
    let gridTemp = arrayInit(rows, cols);
    this.setState({
      gridPosta: gridTemp,
      rows: rows,
      cols: cols,
      playing: false,
      generation: 0
    });
  }


  //opcion seleccionada de nuevo intervalo
  selectInterval = (opt) => {
    switch (opt) {
			case "1":
				this.changeInterval(100);
		  	break;
			case "2":
				this.changeInterval(300);
        break;
      case "3":
        this.changeInterval(1000);
        break;
      case "4":
				this.changeInterval(3000);
		  	break;
			default:
				this.changeInterval(5000);
		}
  }

  //cambio intervalo segun parametro
  changeInterval = (int) => {
    this.pause();
    this.setState({
      interval: int
    });
  }

  //chequeo localStorage, si no hay nada me quedo con lo definido en el constructor
  componentDidMount() {
    if (localStorage.getItem('grid')) {
      let gridTemp = JSON.parse(localStorage.getItem('grid'));
      let rowsTemp = JSON.parse(localStorage.getItem('rows'));
      let colsTemp = JSON.parse(localStorage.getItem('cols'));
      this.setState({
        gridPosta: gridTemp,
        rows: rowsTemp,
        cols: colsTemp
      })
    }
  }

  //desp de cada render actualizo el localStorage, costo/beneficio
  //podria ser con un "beforeunload"
  componentDidUpdate() {
    localStorage.setItem('grid', JSON.stringify(this.state.gridPosta));
    localStorage.setItem('rows', JSON.stringify(this.state.rows));
    localStorage.setItem('cols', JSON.stringify(this.state.cols));
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-md-center marginBot10">
          <h1>The Game of Life - Shipnow</h1>
        </Row>
        <Row className="justify-content-md-center marginBot10">
          <ButtonGroup>
            <Button variant="primary" onClick={this.nextStep} disabled={this.state.playing}>
              Iniciar
            </Button>
            <Button variant="primary" onClick={this.pause} disabled={!this.state.playing}>
              Detener
            </Button>
            <Button variant="primary" onClick={this.reset}>
              Reiniciar
            </Button>
            <Button variant="primary" onClick={this.randomLoad}>
              Cargar
            </Button>
            <Button variant="primary" onClick={this.stepByStep} disabled={this.state.playing}>
              Paso a Paso
            </Button>
            <DropdownButton as={ButtonGroup} id="dropdown-size" title="Tamaño" onSelect={this.changeSelect}> 
              <Dropdown.Item eventKey="1">Chico</Dropdown.Item>
              <Dropdown.Item eventKey="2">Mediano</Dropdown.Item>
              <Dropdown.Item eventKey="3">Grande</Dropdown.Item>
            </DropdownButton>
            <DropdownButton as={ButtonGroup} id="dropdown-interval" title="Intervalo" onSelect={this.selectInterval}> 
              <Dropdown.Item eventKey="1">100</Dropdown.Item>
              <Dropdown.Item eventKey="2">300</Dropdown.Item>
              <Dropdown.Item eventKey="3">1000</Dropdown.Item>
              <Dropdown.Item eventKey="4">3000</Dropdown.Item>
              <Dropdown.Item eventKey="5">5000</Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        </Row>       
        <Row className="justify-content-md-center marginBot10">
          Generación #{this.state.generation} - Intervalo Actual: {this.state.interval} ms
        </Row>
        <Row className="justify-content-md-center marginBot10">
          <Grid
            grid={this.state.gridPosta}
            rows={this.state.rows}
            cols={this.state.cols}
            onClickCell={this.onClickCell}
          />
        </Row>
      </Container>
    );
  }
}

/*
  Uso json.parse para hacer una copia literal y no apuntar dos veces al mismo array
*/
function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

/*
  Genero toda la grilla con las celulas todas en cero
*/
function arrayInit(rows, cols) {
  return Array(rows).fill().map(() => Array(cols).fill(false));
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
