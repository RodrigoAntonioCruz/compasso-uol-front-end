import React, { Component } from 'react';
import './styles/global.css';
import api from './services/api';

class App extends Component {

  state = {
    repositorios: [],
    usuario: "",
    nomePesquisa:""
  }
 
  // PESQUISA POR USUÁRIO
  search = (e) => {
    api.get('/users/'+e+'/repos')
        .then(res => {
        this.setState({ repositorios: res.data });
        })
        .catch(error => {
        console.log("")
    });
    
    api.get('/users/'+e)
        .then(res => {
        this.setState({ usuario: res.data }); 
        })
        .catch(error => {
      alert("Usuário não encontrado!")
    });
   this.clearForm();
  }
  
  //PEGA OS REPOS MAIS VISITADOS
  starred = () => {
    api.get('/users/' + this.state.usuario.login + '/starred')
        .then(res => {
    this.setState({ repositorios: res.data });
    });
  } 

  // PEGA OS REPOS
  repos = (e) => {
    api.get('/users/' + this.state.usuario.login + '/repos')
        .then(res => {
    this.setState({ repositorios: res.data });
    });
  }
 
  // PEGA O VALOR DO INPUT E GUARDA EM UM STATE
  onChangeHandler = (e)=>{
    this.setState({ nomePesquisa: e.target.value });
  }
  
  // AO CLICAR ENTER FAZ A BUSCA
  onKeyPressHandler = (e)=>{
    if (e.keyCode === 13) {
      this.search(this.state.nomePesquisa) 
    }
  }

  //LIMPA OS INPUTS
  clearForm(e) {
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = "")
    );
  }

  render() {

    const { repositorios } = this.state;
    const { usuario } = this.state;

    return (
        <div className="main-content">
          <nav className="nav-github">
            <div className="header pb-8 pt-8 pt-lg-8 d-flex align-items-center">
              <span className="mask bg-gradient-default opacity-8"></span>
                  <div className="container-fluid">
                    <div className="row justify-content-center">
                      <div className="col-lg-6 col-md-6">
                        <div className="row justify-content-center">
                          <div className="col-xl-12 col-lg-12 col-md-12">              
                            <div className="text-white s1-github">
                              <i className="fa fa-github icon-github s1-github"></i>
                                 <h1 className="display-4 text-white s1-github">GitHub Finder</h1>
                            </div>
                          </div>
                        </div>

                          <div className="text-muted text-center mt-2 mb-3">
                            <div className="navbar-search navbar-search-dark form-inline">
                              <div className="form-group col-md-12">
                                <div className="input-group input-group-alternative col-md-12">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">
                                      <button className="btnSearchGitHub">
                                        <i className="fas fa-search"></i>
                                      </button>
                                      </span>
  	                               <input type="text" onChange={this.onChangeHandler} onKeyDown={this.onKeyPressHandler} className="form-control col-md-12" placeholder="Pesquisar no GitHub"></input>
                                  </div>
                                </div>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
          </nav>

          {!usuario.name ? (""):(
            <div className="container-fluid mt--7">
              <div className="row">
                <div className="col-xl-4 order-xl-2 mb-5 mb-xl-0">
                  <div className="card card-profile shadow">
                    <div className="row justify-content-center">
                      <div className="col-lg-3 order-lg-2">
                        <div className="card-profile-image">
                            <img src={usuario.avatar_url} className="rounded-circle" alt="Perfil GitHub" />
                        </div>
                      </div>
                    </div>

                    <div className="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                      <div className="d-flex justify-content-between">
                        <button onClick={this.repos} className="btn btn-sm btn-primary mr-4"><i className="fa fa-book"></i> Repos</button>
                        <button onClick={this.starred} className="btn btn-sm btn-default float-right"><i className="fa fa-star-o "></i> Starred</button>

                      </div>
                    </div>

                    <div className="card-body pt-0 pt-md-4">
                      <div className="row">
                        <div className="col">
                          <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                            <div>
                              <span className="heading">{ usuario.public_repos }</span>
                              <span className="description">Repositórios </span>
                            </div>
                            <div>
                              <span className="heading">{ usuario.followers }</span>
                              <span className="description">Seguidores</span>
                            </div>
                            <div>
                              <span className="heading">{usuario.following}</span>
                              <span className="description">Seguindo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <h3>
                          { usuario.name }
                        </h3>
                        <div className="h5 font-weight-300">
                          {<span></span>}{ !usuario.location ? ("") : (<i className="fa fa-map-marker mr-2"></i>)}<span></span>{usuario.location}
                        </div>
                        <div className="h5 mt-4">
                          {<span></span>}{ !usuario.blog ? ("") : (<i className="fa fa-link mr-2"></i>)}<span></span><a href={usuario.blog} target="_blank" rel="noopener noreferrer">{usuario.blog}</a>
                        </div>

                        <hr className="my-4"/>
                        <p>{ usuario.bio }</p>
                        <a href={usuario.html_url} className="btn btn-danger" target="_blank" rel="noopener noreferrer">Ver perfil no GitHub</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-8 order-xl-1">
                  <div className="card bg-secondary shadow">
                    <div className="card-header bg-white border-0">
                      <div className="row align-items-center">
                        <div className="col-8">
                          <h3 className="mb-0">Repositórios </h3> 
                      </div>
                    </div>
                  </div>

    		          {repositorios.map(repos => (
    		            <div className="card-body column-md-3" key={repos.id}>
    			            <div className="card">
    			                <div className="card-header">
    			                  <h6 className="heading-small text-muted mb-0">{repos.name}</h6>
    			                </div>
    			                <div className="card-body">
    			                  <h5 className="card-title">{usuario.login}/{repos.name}</h5>
    			                  <p className="card-title">
    			                        <span className="btn btn-sm  btnStars mr-2">Stars: {repos.stargazers_count}</span>
    			                        <span className="btn btn-sm  btnWatch mr-2">Watchers: {repos.watchers_count}</span>
    			                        <span className="btn btn-sm  btnForks mr-2">Forks: {repos.forks_count}</span>
    		                      </p>
    			                  <p className="card-text">{repos.description}</p>
    			                  <a href={repos.html_url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Ver repo no GitHub</a>
    			              </div>
    			            </div>
    		            </div>
    		          ))}

              </div>
            </div>
          </div>
         </div>
        )
      }
    </div>
    );
  };
};

export default App;
