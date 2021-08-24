import React, { useState, useEffect } from "react";
import { IRIS } from "@databalk/iris-sdk-js";
import FlowContent from "./flowcontent";
import "./App.css";

// const client = new IRIS("https://www.woonplezier.nu");

// const login = await client.auth.appLogin({
//   appKey: "abcdefgh-1234-abcd-vxyz-ijklmnop5678",
//   secret: "s3cr3t123!",
// });

// const data = await client.flow.init("BP_Reparatieverzoek");

function App() {
  const [data, setData] = useState({});
  const [token, setToken] = useState("-");
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const Login = () => {
    const loginData = {
      appKey: "D167BC13-0848-4A8A-9823-9D8B9DACE899",
      secret: "xs4crm@iris",
    };
    // console.log("login running");
    fetch("https://TeamBP-VeraDev.azurewebsites.net/api/iris/auth/applogin", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(loginData),
    })
      .then((r) => r.json())
      .then((res) => {
        setLoading(false);
        setToken(res.token);
        setData(res);
        // this.setState({
        //   loading: false,
        //   token: res.token,
        //   data: res,
        // });
        /* Initiate the flow */
        // this.initFlow({ token: res.token });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const continueFlow = (data, token, id) => {
    if (data !== "") {
      data = JSON.parse(data);
      console.log(data);
    }

    fetch(
      "https://TeamBP-VeraDev.azurewebsites.net/api/iris/flow/instance/" +
        id +
        "/continue?debug=true",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((r) => r.json())
      .then((res, prevState) => {
        console.log(prevState);
        console.log(res);
        this.setState({
          loading: false,
          token: token,
          data: res,

          question: res.elements[0].data.text,

          //   renderResp: "",
        });

        console.log(this.state.renderResp);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    Login();
  }, []);

  const initFlow = (props) => {
    console.log(props);
    fetch(
      "https://TeamBP-VeraDev.azurewebsites.net/api/iris/flow/instance/BP_Reparatieverzoek/init",
      {
        method: "POST",
        headers: { Authorization: "Bearer " + props.token },
        body: JSON.stringify(),
      }
    )
      .then((r) => r.json())
      .then((res) => {
        setLoading(false);
        setToken(props.token);
        setData(res);
        // this.setState({
        //   loading: false,
        //   token: props.token,
        //   data: res,
      });

    // .catch((error) => {
    //   console.error("Error:", error);
    // });
  };
  return (
    <div className="App">
      <FlowContent
        initFlow={initFlow}
        token={token}
        flow={"BP_Reparatieverzoek"}
        continueFlow={continueFlow}
        data={data}
      />
    </div>
  );
}

export default App;
