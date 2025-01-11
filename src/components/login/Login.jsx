import React from "react";
import Logo from "../../assets/img/logo_rounded.png";

const Login = () => {
  return (
    <section>
      <div className="container pt-5 mt-5">
        <div className="row">
          <div className="col-12 col-sm-8 col-md-6 m-auto">
            <div className="card text-center">
              <div className="card-body">
                <img src={Logo} className="mb-4" alt="Logo del Sistema" style={{ width: "100px", height: "100px", marginTop: "-75px" }} />
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
