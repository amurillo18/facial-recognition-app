import React, { Component } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Navigation from './components/navigation/navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';

const particlesOptions = {
 particles: { 
  color: {
    value: '#610775'
  },
    number: {
      value: 300,
      density: {
        enable: true,
        area: 800
      }
    }
  }
 }

 const particlesInit = async (main) => {
    console.log(main);
     await loadFull(main);
  };
  const particlesLoaded = (container) => {
    console.log(container);
  }; 

  const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signout',
      isSignedIn: false,
      user: {
         id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''

      }
  }
   
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signout',
      isSignedIn: false,
      user: {
         id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''

      }
    }
  }

    loadUser = (data) => {
      this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }})
    }

    calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    }

    displayFaceBox = (box) => {
      this.setState({box: box});
    }


    onInputChange = (event) => {
      this.setState({input: event.target.value});
    } 


    onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input});
      fetch('https://gentle-woodland-79578.herokuapp.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
          })
      .then(response => response.json())
      .then(response => { 
        if (response) {
          fetch('https://gentle-woodland-79578.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
      if (route === 'signout') {
        this.setState(initialState)
      } else if (route === 'home') {
        this.setState({isSignedIn: true})
      }
      this.setState({route: route});
    }

     
    render() {
      const { isSignedIn, imageUrl, route, box } = this.state;
      return (
        <div className="App">
          <Particles className='particles' 
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={ particlesOptions}
         />
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
          { route ==='home' 
            ? <div>
                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries} />
                <ImageLinkForm 
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit} 
                />
                <FaceRecognition box={box} imageUrl={imageUrl} />
              </div>
            : (
                route === 'signout' 
                ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )
              
          }
      </div>
    );
  }
}  

export default App;
