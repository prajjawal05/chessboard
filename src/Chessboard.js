import { useState } from "react";
import styled from "styled-components";

// I am not very good with CSS so I have to google about it.
// I am sorry I forgot about CSS in our call.

const StyledBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 60px);
  grid-template-rows: repeat(8, 60px);
  border: 3px solid #444; 
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const StyledSquare = styled.div`
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #999;

    background: ${({ rowIndex, colIndex }) => ((rowIndex + colIndex) % 2 === 1 ? 'linear-gradient(135deg, #333 0%, #555 100%)' : 'linear-gradient(135deg, #fff 0%, #ddd 100%)')};
`;

const INITIAL_BOARD = [
    ['R', 'H', 'B', 'K', 'Q', 'B', 'H', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'H', 'B', 'K', 'Q', 'B', 'H', 'R']
];


const Square = ({ i, j }) => {
    return (
        <div>{`${i}, ${j} `}</div>
    )
}



const Board = () => {
    let [board, updateBoard] = useState(INITIAL_BOARD);

    return (
        <StyledBoard>
            {board.map((row, rowIndex) => {
                return row.map((cell, colIndex) => {
                    const isBlack = (rowIndex + colIndex) % 2 === 1;
                    const className = isBlack ? 'black' : 'white';
                    return (
                        <StyledSquare key={`${rowIndex} -${colIndex} `} className={className} rowIndex={rowIndex} colIndex={colIndex}>
                            {cell !== 'E' && <div className={`piece ${cell.toLowerCase()} `}>{cell}</div>}
                        </StyledSquare>
                    );
                });
            })}
        </StyledBoard>
    )
}

export default Board;