import { useState } from "react";
import styled from "styled-components";

// I am not very good with CSS so I have to google about it.
// I am sorry I forgot about CSS in our call.

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
  height: 100vh;
`;

const TextSection = styled.div`
  width: 300px;
  padding: 20px;
  border: 3px solid #3b2d2c;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background: #f8f1e4;
`;

const StyledBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 60px);
  grid-template-rows: repeat(8, 60px);
`;

const StyledSquare = styled.div`
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #8c6d62;

    background: ${({ rowIndex, colIndex }) => ((rowIndex + colIndex) % 2 === 1 ? '#e3c19b' : '#a47e56')};
`;

const Piece = styled.div`
  font-size: ${(props) => (props.isKing ? '50px' : '20px')};
  color: ${(props) => (props.isWhite ? '#fff' : '#000')};
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const INITIAL_BOARD = [
    ['BR', 'BH', 'BB', 'BK', 'BQ', 'BB', 'BH', 'BR'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WH', 'WB', 'WK', 'WQ', 'WB', 'WH', 'WR']
];


const Square = ({ rowIndex, colIndex, cell }) => {
    const isBlack = (rowIndex + colIndex) % 2 === 1;
    const className = isBlack ? 'black' : 'white';
    console.log(cell, cell.startsWith('W'));
    return (
        <StyledSquare key={`${rowIndex} -${colIndex} `} className={className} rowIndex={rowIndex} colIndex={colIndex}>
            {cell !== 'E' &&
                <Piece isKing={cell[1] === 'K'} isWhite={cell[0] == ('W')}>
                    {cell[1]}
                </Piece>
            }
        </StyledSquare >
    );
}



const Board = () => {
    let [board, updateBoard] = useState(INITIAL_BOARD);
    const [currentPlayer, updatePlayer] = useState('W');
    const [selectedPiece, updateSelectedPiece] = useState(null);

    return (
        <Container>
            <StyledBoard>
                {board.map((row, rowIndex) => {
                    return row.map((cell, colIndex) => {
                        return (
                            <Square cell={cell} rowIndex={rowIndex} colIndex={colIndex} />
                        )
                    });
                })}
            </StyledBoard>
            <TextSection>
                <h1>Game Information</h1>
                <p>Player {`${currentPlayer == 'W' ? 1 : 2}`} to move</p>
                {selectedPiece &&
                    <p>Selected Piece is {board[selectedPiece[0]][selectedPiece[1]]}</p>
                }
            </TextSection>
        </Container>
    )
}

// const Game = () => {
//     return (
//         <>
//             <StyledGame>
//                 Chess
//                 <Board />

//             </StyledGame>
//         </>
//     )
// }



export default Board;