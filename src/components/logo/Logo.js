import React from 'react';
import Tilt from 'react-parallax-tilt';
import logo from './logo.png';
import './Logo.css';


const Logo = () => {
	return(
		<div className='ma4 mt0'> 
			<Tilt className="Tilt" options={{ max :55 }} style={{ height: 100, width: 100 }}>
		      <div className="Tilt-inner pa3">
		        <img style={{paddingTop: '5px'}} alt='logo' src={logo}/>
		      </div>
	    	</Tilt>
		</div>
	);	
}

export default Logo;