import './App.css';
import styled from 'styled-components'
import {useEffect, useState} from "react";

const BIRD_SIZE = 20;
const GAME_SIZE = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 60;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;
const OBSTACLE_SCROLL_SPEED = 6;

function App() {

    const [birdPos, setBirdPos] = useState(250);
    const [gameHasStarted, setGameStarted] = useState(false);
    const [obstacleHeight, setObstacleHeight] = useState(100);
    const [obstacleLeft, setObstacleLeft] = useState(GAME_SIZE - OBSTACLE_WIDTH);
    const [score, setScore] = useState(0);

    const bottomObstacleHeight = GAME_SIZE - obstacleHeight - OBSTACLE_GAP;

    console.log(birdPos)

    useEffect(() => {
        let timeId
        if (gameHasStarted && birdPos < GAME_SIZE - BIRD_SIZE) {
            timeId = setInterval(() => {
                setBirdPos(birdPos => birdPos + GRAVITY)
            }, 24)
        }
        let cleanInterval = () => {
            clearInterval(timeId)
        };
        return cleanInterval;
    }, [birdPos, gameHasStarted])

    useEffect(() => {
        let timeId;
        if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
            timeId = setInterval(() => {
                setObstacleLeft(obstacleLeft => obstacleLeft - OBSTACLE_SCROLL_SPEED)
            }, 24)
            let cleanInterval = () => {
                clearInterval(timeId)
            };
            return cleanInterval;
        } else {
            debugger
            setObstacleLeft(GAME_SIZE - OBSTACLE_WIDTH)
            setObstacleHeight(Math.floor(Math.random() * (GAME_SIZE - OBSTACLE_GAP)));
            setScore(score => gameHasStarted ? score + 1 : score)
        }
    }, [obstacleLeft, gameHasStarted])

    useEffect(() => {
        const hasCollidedWithTopObstacle = birdPos >= 0 && birdPos < obstacleHeight;
        const hasCollidedWithBottomObstacle = birdPos <= 500 && birdPos >= 500 - bottomObstacleHeight;

        if ((obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle))
            || birdPos > (GAME_SIZE - 30)) {
            setGameStarted(false)
            setScore(0)
            setBirdPos(250)
        }
    }, [birdPos, obstacleHeight, bottomObstacleHeight, obstacleLeft])

    let onClick = () => {
        let newBirdPos = birdPos - JUMP_HEIGHT;
        if (!gameHasStarted) {
            setGameStarted(true);
        } else if (newBirdPos < 0) {
            setBirdPos(0)
        } else {
            setBirdPos(newBirdPos)
        }
    }

    return (
        <Container>
            <GameBlock onClick={onClick} size={GAME_SIZE}>
                <div className={'score'}>{score}</div>
                {!gameHasStarted && <StartButton>Tap to Start</StartButton>}
                <Obstacle
                    top={0}
                    width={OBSTACLE_WIDTH}
                    height={obstacleHeight}
                    left={obstacleLeft}
                />
                <Obstacle
                    top={GAME_SIZE - (obstacleHeight + bottomObstacleHeight)}
                    width={OBSTACLE_WIDTH}
                    height={bottomObstacleHeight}
                    left={obstacleLeft}
                />
                <Bird size={BIRD_SIZE} top={birdPos}/>

            </GameBlock>
        </Container>
    );
}

export default App;

const Bird = styled.div`
  position: absolute;
  background: red;
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  top: ${props => props.top}px;
  border-radius: 50%;
`;

const StartButton = styled.button`
  position: absolute;
  width: 150px;
  //text-align: center;
  left: calc(55% - 150px);
  top: 25%;
  background: none;
  border: none;
  font-size: 24px;
  color: white;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 721px;
  //align-items: center;
  justify-content: center;
  background: darkgreen;
`;

const GameBlock = styled.div`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  background: forestgreen;
  overflow: hidden;
  //border: solid 5px #003100;

  & .score {
    position: absolute;
    width: 500px;
    color: white;
    font-size: 32px;
    text-align: center;
    top: 20px;
    z-index: 1;
  }
`;

const Obstacle = styled.div`
  position: relative;
  top: ${props => props.top}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  left: ${props => props.left}px;
  background: #003100;
`