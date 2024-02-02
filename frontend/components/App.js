import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { axiosWithAuth } from '../axios'

// navigate relpace true option => inaccesible history


const articlesUrl = '/articles'
const loginUrl = '/login'
// const baseURL = 'http://localhost:3000'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {navigate('/')}
  const redirectToArticles = () => {navigate(articlesUrl)}

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

   const login = ({ username, password }) => {
    // setMessage('');
    axiosWithAuth().post(loginUrl, {username, password})
    .then(res => {
      console.log(res)
      // setMessage(res.data.message);
      localStorage.setItem('token', res.data.token)
      setSpinnerOn(false);
      redirectToArticles();
    })
    .catch((err) => {
      console.log(err);
    })
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    //is spinner on by default ??? 
  }

  const getArticles = () => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth()
      .get("/articles")
      .then(res => {
        setMessage(res.data.message);
        setArticles(res.data.articles);
        setSpinnerOn(false);
      })
      .catch(err => {
        setSpinnerOn(false);
        setMessage(err.response.statusText);
        redirectToLogin();
      })

    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().post('/articles', article)
      .then(res => {
        setMessage(res.data.message);
        setSpinnerOn(false);
        setArticles([...articles, res.data.article])
        redirectToArticles();
      })
      .catch(err => {
        setSpinnerOn(false);
        setMessage(err.response.statusText)
        redirectToArticles();
      })
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ({ article_id, article }) => {
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth().put(`/articles/${article_id}`, article)
    .then(res => {
      setMessage(res.data.message);
      setSpinnerOn(false);

      for(let i=0; i < articles.length; i++) {
        if(article_id === articles[i].article_id){
          article[i] = { ...res.data.article }
        }
      }
    })
    .catch(err => {
      setSpinnerOn(false);
      setMessage(err.response.statusText)
      redirectToArticles();
    })
    // ✨ implement
    // You got this!
  }

  const currentArticle = () => {
    const filteredArt = articles.filter(article => article.article_id === currentArticleId)
    if(filteredArt.length === 0) {
      return null;
    }else{
      return filteredArt[0];
    }
  }

  const deleteArticle = article_id => {
    // setMessage("");
    setSpinnerOn(true);
    axiosWithAuth().delete(`/articles/${article_id}`)
    .then(res => {
      setMessage(res.data.message);
      setArticles(articles.filter(article => {
        return article_id !== article.article_id
      }))
      setSpinnerOn(false);
    })
    .catch(err => {
      setSpinnerOn(false);
      setMessage(err.response.statusText)
    })
    // ✨ implement
  }

  

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to='/'>Login</NavLink>
          <NavLink id="articlesScreen" to={articlesUrl}>Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" 
            element={<LoginForm 
            login={login} 
            setMessage={setMessage}/>} 
          />
          <Route 
            path="articles" 
            element={
            <>
              <ArticleForm 
                setCurrentArticleId={setCurrentArticleId}
                postArticle={postArticle}
                updateArticle={updateArticle}
                currentArticle={currentArticle()}
              />
              <Articles 
                articles={articles}
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
