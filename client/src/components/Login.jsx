import React from "react";
import "./Login.css";
import timeIcon from "../assets/time.png";
import image from "../assets/bgimg.png";
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  return (
    // <div className="d-flex vh-100 align-items-center justify-content-center bg-light">
      <div className="login-container d-flex shadow-lg rounded-4 overflow-hidden">
        <div className="login-center-div row">
          <div className="col-md-6">
            <img src={timeIcon} alt="" srcset="" style={{width: '100%'}} />
          </div>
          <div className="col-md-6">
            <div className="login-form bg-white ">
            <h2 className="mb-1 text-primary fw-bold text-nowrap">
  Welcome to Timesheet
</h2>

              <div className="">
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your Employee ID"
                />
              </div>
              <div className="">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                />
              </div>
              <button className="btn btn-primary w-100">Login</button>
            </div>
          </div>
        </div>
        {/* <div className="login-image bg-white p-4"></div>
        <div className="d-flex vh-100 align-items-center justify-content-center login-background"></div>
        <div className="d-flex vh-100 align-items-center justify-content-center login-bgimg.png">
          <div className="login-container d-flex shadow-lg rounded-4 overflow-hidden"></div>
        </div> */}

        {/* Right Side Form */}
      </div>
    // </div>
  );
}

export default Login;
