import React, {Component} from 'react'
import Draggable from 'react-draggable'
import {Resizable} from 're-resizable'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      posts: [],
      backImg: '',
      customText: '',
      textOverlays: [],
      editingTextId: null,
    }
  }

  componentDidMount() {
    const randomPage = Math.floor(Math.random() * 10) + 1

    fetch(
      `https://api.unsplash.com/search/photos?page=${randomPage}&query=nature&client_id=BHiwX9YtcexlLwXWC6Wt6of7MVpwYLS7ej6n47WSsLc`,
    )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const randomImageIndex = Math.floor(Math.random() * data.results.length)
        const randomImageUrl = data.results[randomImageIndex]?.urls?.full

        this.setState({
          posts: data,
          backImg: randomImageUrl,
        })
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  handleTextChange = event => {
    this.setState({customText: event.target.value})
  }

  addTextOverlay = () => {
    const {customText, textOverlays} = this.state

    if (customText) {
      const newOverlay = {
        id: Date.now(),
        text: customText,
        position: {x: 100, y: 100},
        size: {width: 100, height: 50},
      }

      this.setState({
        textOverlays: [...textOverlays, newOverlay],
        customText: '',
      })
    }
  }

  handleEditClick = id => {
    this.setState({editingTextId: id})
  }

  handleEditText = (event, id) => {
    const {textOverlays} = this.state
    const updatedTextOverlays = textOverlays.map(overlay => {
      if (overlay.id === id) {
        return {...overlay, text: event.target.value}
      }
      return overlay
    })
    this.setState({textOverlays: updatedTextOverlays})
  }

  handleTextBlur = () => {
    this.setState({editingTextId: null})
  }

  handleDrag = (id, e, data) => {
    const {textOverlays} = this.state
    const updatedTextOverlays = textOverlays.map(overlay => {
      if (overlay.id === id) {
        return {...overlay, position: {x: data.x, y: data.y}}
      }
      return overlay
    })
    this.setState({textOverlays: updatedTextOverlays})
  }

  handleResize = (id, e, direction, ref) => {
    const {textOverlays} = this.state
    const updatedTextOverlays = textOverlays.map(overlay => {
      if (overlay.id === id) {
        return {
          ...overlay,
          size: {width: ref.style.width, height: ref.style.height},
        }
      }
      return overlay
    })
    this.setState({textOverlays: updatedTextOverlays})
  }

  render() {
    const {backImg, customText, textOverlays, editingTextId} = this.state

    return (
      <>
        <div className="text-input-container">
          <input
            type="text"
            placeholder="Enter text"
            value={customText}
            onChange={this.handleTextChange}
            className="custom-text-input"
          />
          <button onClick={this.addTextOverlay} className="add-text-button">
            Add Text
          </button>
        </div>

        <div className="bgimg">
          <img className="backimg" src={backImg} alt="Fetched Image" />

          {textOverlays.map(overlay => (
            <Draggable
              key={overlay.id}
              bounds="parent"
              defaultPosition={{x: overlay.position.x, y: overlay.position.y}}
              onDrag={(e, data) => this.handleDrag(overlay.id, e, data)}
            >
              <Resizable
                style={{
                  position: 'absolute',
                  border: '1px solid blue',
                }}
                defaultSize={{
                  width: overlay.size.width,
                  height: overlay.size.height,
                }}
                onResize={(e, direction, ref) =>
                  this.handleResize(overlay.id, e, direction, ref)
                }
              >
                {editingTextId === overlay.id ? (
                  <textarea
                    value={overlay.text}
                    onChange={e => this.handleEditText(e, overlay.id)}
                    onBlur={this.handleTextBlur}
                    autoFocus
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      resize: 'none',
                      fontSize: '24px',
                    }}
                  />
                ) : (
                  <div
                    className="overlay-text"
                    onClick={() => this.handleEditClick(overlay.id)}
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '24px', // Increase text size
                    }}
                  >
                    {overlay.text}
                  </div>
                )}
              </Resizable>
            </Draggable>
          ))}
        </div>
      </>
    )
  }
}

export default App
