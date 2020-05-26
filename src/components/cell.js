import React, { Component } from 'react';

class Cell extends Component {
  
  //callback
  onClickCell = () => {
      this.props.onClickCell(this.props.row, this.props.col);
    }
    
    //aca es donde renderizo cada celula 
    render() {
      return (
        <div 
          className={this.props.cellClass}
          id={this.props.id}
          onClick={this.onClickCell}
        />
      );
    }
  
  }

export default Cell;