import logo from './logo.svg';
import './App.css';
import Stack from 'react-bootstrap/Stack';
import { useEffect, useState, useRef } from 'react';

function App() {

  const SECONDS = 60;

  const BREAK = 5 * SECONDS;
  const SESSION = 25 * SECONDS;

  const [isSession, setSession] = useState(true);
  const [isPaused, setPaused] = useState(true);

  const [breakLength, setBreakLength] = useState (BREAK);
  const [sessionLength, setSessionLength] = useState (SESSION);
  const [time, setTime] = useState (isSession ? sessionLength : breakLength);

  const interval = useRef();
  const beep = useRef();
  
  useEffect(() =>
  {
    console.log ("useEffect isPaused");

    if (isPaused) {
      clearInterval (interval.current);
    } else {
      interval.current = setInterval(() =>
      {
        setTime(time => time - 1);
      }, 1000);
    }
  }, [isPaused]);
  
  useEffect(() =>
  {
    console.log ("useEffect time");

    if (time < 0)
    {
      setSession (s => {
        beep.current.play();
        const newSession = !s;
        setTime (newSession ? sessionLength : breakLength);
        return newSession;
      });
    }
  }, [time]);
  
  useEffect(() =>
  {
    console.log ("useEffect breakLength, sessionLength");

    if (isPaused) {
      setTime (isSession ? sessionLength : breakLength);
    }    
  }, [breakLength, sessionLength]);
  
  // useEffect(() =>
  // {
  //   console.log ("useEffect breakLength, sessionLength");

  //   if (isPaused) {
  //     setTime (isSession ? sessionLength : breakLength);
  //   }    
  // }, [breakLength, sessionLength]);

  // https://stackoverflow.com/questions/63003690/unable-to-pause-audio-in-reactjs

  return (
    <div className="App container border square">

      <audio id="beep" ref={beep} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"/>
    
      <Stack direction="vertical" gap={3}>
        <Stack direction="horizontal" gap={3} style={{ justifyContent: 'center' }}>
          <div>
            <label id="break-label" className="control">Break Length</label>
            <div>
              <button id="break-decrement" className="control" onClick={()=>{
                setBreakLength (l=>Math.max (l - SECONDS, SECONDS));
              }}>-</button>
              <label id="break-length" className="control">{breakLength / SECONDS}</label>
              <button id="break-increment" className="control" onClick={()=>{
                setBreakLength (l=>Math.min (l + SECONDS, 60 * SECONDS))
              }}>+</button>
            </div>
          </div><div>
            <label id="session-label" className="control">Session Length</label>
            <div>
              <button id="session-decrement" className="control" onClick={()=>{
                setSessionLength (l=>Math.max (l - SECONDS, SECONDS))
              }}>-</button>
              <label id="session-length" className="control">{sessionLength / SECONDS}</label>
              <button id="session-increment" className="control" onClick={()=>{
                setSessionLength (l=>Math.min (l + SECONDS, 60 * SECONDS))
              }}>+</button>
            </div>
          </div>
        </Stack>
        <div>
          <div>
            <label id="timer-label">{isSession ? 'Session' : 'Break'}</label>
          </div>
          <div>
            <label id="time-left">
            {Math.floor (time / SECONDS).toLocaleString ('en-US', {minimumIntegerDigits: 2 })}:{(time % SECONDS).toLocaleString ('en-US', {minimumIntegerDigits: 2 })}</label>
          </div>
          <div>
            <button id="start_stop" className='control' onClick={() => {setPaused (p => !p)}}>Play/pause</button>
            <button id="reset" className='control' onClick={() => {

              //document.getElementById ("beep").pause();
              beep.current.pause();
              beep.current.currentTime = 0;

              console.log ("reset");

              setPaused(true);
              setSession(true);
              setBreakLength (BREAK);
              setSessionLength (SESSION);
              setTime (SESSION);
            }}>Reset</button>
          </div>
        </div>
      </Stack>
    </div>
  );
}

export default App;
