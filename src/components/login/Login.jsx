import React from "react";
import Logo from "../../assets/img/logo.png";
import './styles/login.css';

const Login = () => {
  return (
    <section className="mt-5 pt-5">
      <div className="container pt-5 mt-5">
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 m-auto">
            <div className="card shadow text-center">
              <div className="card-body">
                <img src={Logo} className="shadow mb-4" alt="Logo del Sistema" />
                <form>
                  <div className="form-group text-start mb-3">
                    <label className="font-weight-bold">Usuario</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Introduzca su Usuario"
                    />
                  </div>
                  <div className="form-group text-start mb-3">
                    <label className="font-weight-bold">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Introduzca su Contraseña"
                    />
                  </div>
                  <div className="form-group text-center mb-3">
                    <button type="submit" className="btn btn-primary btn-block">
                      Iniciar Sesión
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
