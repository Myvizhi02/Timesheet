import React from 'react';
import homeIcon from '../home.png';
import imgIcon from '../img.png';
import navIcon from '../navigation.png';

const Header = () => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        width: '1442px',
        height: '70px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

      }}>
      <img src={navIcon} alt="Navigation Icon"
        style={
          {
            width: '26px',
            marginLeft: '34px',
            marginTop: '23px',
            marginBottom: '21px'
          }}></img>
      <img src={homeIcon} alt="Home Icon"
        style={
          {
            width: '24px',
            marginRight: '20px',
            marginTop: '24px',
            marginBottom: '22px',
            marginLeft: '20px'
          }}></img>
      <span className="m-0"
        style={
          {
            fontSize: '1.2rem',
            marginTop: '25px',
            marginBottom: '23px',
            marginRight: '999px',
            width: '93px',
            height: '22px',
          }}>Dashboard</span>
      <span className="m-0"
        style={
          {
            fontSize: '1.2rem',
            width: '135.65px',
            height: '22px',
            textAlign: 'right'
          }}>Pradeep Shiva</span>
      <img src={imgIcon} alt="Image Icon"
        style={
          {
            width: '36px',
            height: '36px',
            marginTop: '18px',
            marginBottom: '17px',
            marginLeft: '34px'

          }}></img>
    </div>
  )
}

export default Header