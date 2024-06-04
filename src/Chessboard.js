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
    cursor: ${({ isEligibile }) => isEligibile ? 'pointer' : 'no-drop'};
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

const getPawnEligibility = (board, rowIndex, colIndex, selectedRow, selectedCol) => {
    if (selectedRow == 6) {
        if ((rowIndex == 4 || rowIndex == 5) && colIndex == selectedCol && board[rowIndex][colIndex] == 'E') {
            return true;
        }
        if (board[rowIndex][colIndex] == 'E') {
            return false;
        }
        if (rowIndex == 5 && Math.abs(colIndex - selectedCol) == 1 && board[rowIndex][colIndex][0] != 'E') {
            return true;
        }
    }
    if (rowIndex == selectedRow - 1 && colIndex == selectedCol && board[rowIndex][colIndex] == 'E') {
        return true;
    }
    if (rowIndex == selectedRow - 1 && Math.abs(colIndex - selectedCol) == 1 && board[rowIndex][colIndex][0] != 'E') {
        return true;
    }
    return false;
}

const isPathClear = (board, selectedRow, selectedCol, rowIndex, colIndex) => {
    const rowStep = Math.sign(rowIndex - selectedRow);
    const colStep = Math.sign(colIndex - selectedCol);
    let currentRow = selectedRow + rowStep;
    let currentCol = selectedCol + colStep;

    while (currentRow !== rowIndex || currentCol !== colIndex) {
        if (board[currentRow][currentCol] !== 'E') return false;
        currentRow += rowStep;
        currentCol += colStep;
    }
    return true;
};

const getRookEligibility = (board, rowIndex, colIndex, selectedRow, selectedCol) => {
    if (rowIndex != selectedRow && colIndex != selectedCol) return false;

    if (isPathClear(board, selectedRow, selectedCol, rowIndex, colIndex)) {
        return true;
    }

    return false;
}

const getBishopEligibility = (board, rowIndex, colIndex, selectedRow, selectedCol) => {
    if (Math.abs(rowIndex - selectedRow) !== Math.abs(colIndex - selectedCol)) return false;

    if (isPathClear(board, selectedRow, selectedCol, rowIndex, colIndex)) {
        return true;
    }

    return false;
}

const getKnightEligibility = (board, rowIndex, colIndex, selectedRow, selectedCol) => {
    const verticalMove = Math.abs(rowIndex - selectedRow);
    const horizontalMove = Math.abs(colIndex - selectedCol);

    const isLShapeMove = (verticalMove === 2 && horizontalMove === 1) ||
        (verticalMove === 1 && horizontalMove === 2);

    return isLShapeMove;
}

const getQueenEligibility = (board, rowIndex, colIndex, selectedRow, selectedCol) => {
    const isSameRow = rowIndex === selectedRow;
    const isSameCol = colIndex === selectedCol;
    const isDiagonal = Math.abs(rowIndex - selectedRow) === Math.abs(colIndex - selectedCol);

    if ((isSameRow || isSameCol || isDiagonal) && isPathClear(board, selectedRow, selectedCol, rowIndex, colIndex))
        return true;

    return false;
}

const getKingEligibility = (board, rowIndex, colIndex, selectedRow, selectedCol) => {
    if (Math.abs(rowIndex - selectedRow) <= 1 && Math.abs(colIndex - selectedCol) <= 1)
        return true;

    return false;
}

const pieceEligibility = {
    'P': getPawnEligibility,
    'R': getRookEligibility,
    'B': getBishopEligibility,
    'H': getKnightEligibility,
    'K': getKingEligibility,
    'Q': getQueenEligibility,
}

const pieceName = {
    'P': 'Pawn',
    'R': 'Rook',
    'B': 'Bishop',
    'H': 'Knight',
    'K': 'King',
    'Q': 'Queen',
}


const getEligibility = (board, rowIndex, colIndex, selectedRow, selectedCol, currentPlayer) => {
    if (rowIndex == selectedRow && colIndex == selectedCol) return true;
    if (board[rowIndex][colIndex][0] == currentPlayer) return false;
    return pieceEligibility[board[selectedRow][selectedCol][1]](board, rowIndex, colIndex, selectedRow, selectedCol);
}


const Square = ({ board, currentPlayer, rowIndex, colIndex, selectedRow, selectedCol, onClick }) => {
    const [isEligibile, updatEligibility] = useState(true);

    const currentcell = board[rowIndex][colIndex];

    const handleMouseEnter = () => {
        if (!selectedRow) {
            if (board[rowIndex][colIndex][0] == currentPlayer) {
                updatEligibility(true);
            } else {
                updatEligibility(false);
            }
            return;
        }
        const eligibility = getEligibility(board, rowIndex, colIndex, selectedRow, selectedCol, currentPlayer);
        updatEligibility(eligibility);
    }

    const handleMouseLeave = () => {
        updatEligibility(true);
    }

    const handleClick = () => {
        if (!isEligibile) return;
        if (rowIndex == selectedRow && colIndex == selectedCol) {
            onClick(null);
        } else {
            onClick([rowIndex, colIndex]);
        }
    }

    return (
        <StyledSquare
            onClick={handleClick}
            isEligibile={isEligibile} key={`${rowIndex} -${colIndex} `} rowIndex={rowIndex} colIndex={colIndex} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {currentcell !== 'E' &&
                <Piece isKing={currentcell[1] === 'K'} isWhite={currentcell[0] == ('W')}>
                    {currentcell[1]}
                </Piece>
            }
        </StyledSquare >
    );
}



const Board = () => {
    let [board, updateBoard] = useState(INITIAL_BOARD);
    const [currentPlayer, updatePlayer] = useState('W');
    const [selectedPiece, updateSelectedPiece] = useState(null);

    const handleClick = (newSelection) => {
        if (newSelection == null) {
            updateSelectedPiece(null);
            return;
        }

        const updatedChessBoard = JSON.parse(JSON.stringify(board));

        if (selectedPiece == null) {
            updateSelectedPiece([...newSelection]);
        } else {
            const selectedRow = selectedPiece[0];
            const selectedCol = selectedPiece[1];
            updatedChessBoard[newSelection[0]][newSelection[1]] = updatedChessBoard[selectedRow][selectedCol];
            updatedChessBoard[selectedRow][selectedCol] = 'E';
            // board;
            const rotatedBoard = updatedChessBoard.slice().reverse().map(row => row.slice().reverse());
            updateBoard(rotatedBoard);
            updatePlayer(curr => curr == 'W' ? 'B' : 'W');
            updateSelectedPiece(null);
        }
    }

    return (
        <Container>
            <StyledBoard>
                {board.map((row, rowIndex) => {
                    return row.map((cell, colIndex) => {
                        return (
                            <Square
                                board={board}
                                currentPlayer={currentPlayer}
                                cell={cell}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                                selectedRow={selectedPiece?.[0]}
                                selectedCol={selectedPiece?.[1]}
                                onClick={handleClick}
                            />
                        )
                    });
                })}
            </StyledBoard>
            <TextSection>
                <h1>Game Information</h1>
                <p>Player {`${currentPlayer == 'W' ? 1 : 2}`} to move</p>
                {selectedPiece &&
                    <p>Selected Piece is {pieceName[board[selectedPiece[0]][selectedPiece[1]][1]]}</p>
                }
            </TextSection>
        </Container>
    )
}


export default Board;