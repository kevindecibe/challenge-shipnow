import React, { Component } from 'react';
import Cell from './cell';

class Grid extends Component {
    render() {
      //calculo width de acuerdo a la cantidad de columnas
      //16 es el width de cada celula
      const width = this.props.cols * 16;
      let cellArray = [];      

      for (let i = 0; i < this.props.rows; i++) {
        for (let j = 0; j < this.props.cols; j++) {
          let cellId = i + ":" + j;
          //de acuerdo al estado le asigno una clase o la otra, lo unico que cambia es el background
          let cellClass = this.props.grid[i][j] ? "cell alive" : "cell died";

          //la key no la uso pero es requerida por react cuando renderizo una coleccion de componentes
          //una especie de ngFor en angular
          cellArray.push(
            <Cell 
              cellClass={cellClass}
              key={cellId}
              id={cellId}
              row={i}
              col={j}
              onClickCell={this.props.onClickCell}
            />
          );
        }
      }
  
      return(
        <div className="grid" style={{width: width}}>
          {cellArray}
        </div>
      );
    }
  }

export default Grid;