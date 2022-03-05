import React, { useState, useImperativeHandle } from 'react'
import styled from 'styled-components';

const TogglableContent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000000aa;
`;

const Container = styled.div`
  position: absolute;
  background-color: #fff;
  left: 0;
  right: 0;
  top: 15%;
  margin: 0 auto 50px;
  width: 350px;
  outline: 2px solid #0055ff;
  border-radius: 30px 25px;
  padding: 30px 25px;
  button {
    border-radius: 20px;
  }
  @media screen and (max-width: 768px) {
    padding: 20px 15px;
    border-radius: 20px 15px;
    width: calc(94% - 30px);
    max-width: 270px;
  }
  @media screen and (orientation: landscape) {
    top: 5%;
  }
  @media screen and (orientation: portrait) {
    top: 5%;
  }
`;

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const outSideClick = (e) => {
    const background = document.getElementById('background')
    if (e.target === background)
      toggleVisibility()
  }

  useImperativeHandle(ref, () =>  (toggleVisibility))

  return (
    <div>
      <div>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <TogglableContent id='background' style={showWhenVisible} onClick={outSideClick} >
        <Container >
          {props.children}
          <button onClick={toggleVisibility}>cancel</button>
        </Container>
      </TogglableContent>
    </div>
  )
})

export default Togglable