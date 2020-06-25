import React, { Component } from 'react'
import './App.css'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: [],
      currentArticle: {
        url: '',
        title: '',
        body: 'ユーザ名を入力して表示ボタンを押してね😉',
      },
      username: '',
    }
    this.showNewArticle = this.showNewArticle.bind(this)
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
  }

  getRandomIndex(len) {
    return Math.floor(Math.random() * Math.floor(len))
  }

  async showNewArticle(e) {
    try {
      if (this.state.username) {
        const len = this.state.articles.length
        if (len > 0) {
          const index = this.getRandomIndex(len)
          this.setState({ currentArticle: this.state.articles[index] })
        } else {
          const result = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/article?username=${this.state.username}`
          )
          const json = await result.json()
          console.log(json)
          if (json.length > 0) {
            this.setState({ articles: json })
            const index = this.getRandomIndex(json.length)
            this.setState({ currentArticle: this.state.articles[index] })
          } else {
            this.setState({
              currentArticle: {
                url: '',
                title: '',
                body: 'データが無いみたいです・・・😢',
              },
            })
            this.setState({ articles: [] })
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleTextFieldChange(e) {
    console.log(e)
    this.setState({ username: e.target.value })
    this.setState({
      currentArticle: {
        url: '',
        title: '',
        body: 'ユーザ名を入力して表示ボタンを押してね😉',
      },
    })
    this.setState({ articles: [] })
  }

  render() {
    return (
      <React.Fragment>
        <AppBar position="static" className="App-app-bar">
          <Toolbar>
            <Typography variant="h6">
              Qiitaでストックした記事をランダムで出すアプリ
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container className="App-container">
          <Grid item xs={9} className="App-grid-item">
            <TextField
              value={this.state.username}
              onChange={this.handleTextFieldChange}
              id="standard-basic"
              label="ユーザ名"
              variant="outlined"
              className="App-text-field"
            />
          </Grid>
          <Grid item xs={3} className="App-grid-item">
            <Button
              variant="contained"
              color="primary"
              onClick={this.showNewArticle}
              className="App-button"
            >
              表示
            </Button>
          </Grid>
          <Grid item xs={12} className="App-grid-item">
            <Card className="App-card">
              {this.state.currentArticle.url ? (
                <React.Fragment>
                  <span className="App-msg">
                    タイトルクリックで元記事にジャンプ🕴
                  </span>
                  <a
                    href={this.state.currentArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="App-article-title-link"
                  >
                    <h1 className="App-article-title">
                      {this.state.currentArticle.title}
                    </h1>
                  </a>
                  <div>
                    {this.state.currentArticle.body.substring(0, 500) + '...'}
                  </div>
                </React.Fragment>
              ) : (
                <div>{this.state.currentArticle.body}</div>
              )}
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}
