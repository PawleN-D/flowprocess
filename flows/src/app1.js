import React, { useState } from "react";
import { Component } from "react";
import Answer from "./FinalVraag";
import FlowContent from "./flowcontent";
import Flowprocess from "./FlowProcess";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      login: false,
      token: "-",
      data: {},
      question: "",
      renderResp: [],
      process: [
        {
          process: "BP_Reparatieverzoek",
          name: "Reparatieverzoek",
          icon: "./icons/DataBalk-Klantprocessen_Reparatieverzoek.png",
        },
        {
          process: "BP_Huurcontract_beeindigen",
          name: "Huur beeindigen",
          icon: "./icons/DataBalk-Klantprocessen_Huur-beeindigen.png",
        },

        {
          process: "BP_Overlast_melden",
          name: "Overlast melden",
          icon: "./icons/DataBalk-Klantprocessen_Overlast-melden.png",
        },
        {
          process: "BP_Betaallink",
          name: "Betalen",
          icon: "./icons/DataBalk-Klantprocessen_Betalen.png",
        },
        {
          process: "BP_Betaalwijze aanpassen",
          name: "Betaalwijze aanpassen",
          icon: "../icons/DataBalk-Klantprocessen_Betaalwijze-aanpassen.png",
        },
        {
          process: "BP_Contract wijzigen",
          name: "Contract wijzigen",
          icon: "./icons/DataBalk-Klantprocessen_Contract-wijzigen.png",
        },
        {
          process: "BP_Serviceabonnement",
          name: "Serviceabonnement",
          icon: "./icons/DataBalk-Klantprocessen_Serviceabonnement.png",
        },
        {
          process: "BP_Service_en_contact",
          name: "Service en contact",
          icon: "./icons/DataBalk-Klantprocessen_Service-en-contact.png",
        },
        {
          process: "BP_Klachten-melden",
          name: "Klachten",
          icon: "./icons/DataBalk-Klantprocessen_Klachten.png",
        },
        {
          process: "BP_Woning ruilen",
          name: "Woning ruilen",
          icon: "./icons/DataBalk-Klantprocessen_Woning-ruilen.png",
        },
      ],
    };
  }

  updateData(text) {
    this.setState({ data: text });
  }

  addAnswer = (value) => {
    const vraag = this.state.question;
    const andtwoord = value;
    const obj = { question: vraag, answer: andtwoord };

    this.setState({
      renderResp: [...this.state.renderResp, obj],
    });
  };

  /* login to access flows */
  login = () => {
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
        this.setState({
          loading: false,
          token: res.token,
          data: res,
          question: "",
          renderResp: [],
        });
        /* Initiate the flow */
        // this.initFlow({ token: res.token });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  continueFlow = (data, token, id) => {
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

  continueFlow_old = (outputKey, val, token, id, data) => {
    var data1 = JSON.parse('{ "' + outputKey + '" : "' + val + '" }');
    console.log(data1);

    fetch("/api/iris/flow/instance/" + id + "/continue?debug=true", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data1),
    })
      .then((r) => r.json())
      .then((res) => {
        console.log(res);

        this.setState({
          loading: false,
          token: token,
          data: res,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  componentDidMount() {
    return this.login();
  }
  //
  initFlow = (props) => {
    console.log(props);
    fetch(
      "https://TeamBP-VeraDev.azurewebsites.net/api/iris/flow/instance/" +
        props.process +
        "/init",
      {
        method: "POST",
        headers: { Authorization: "Bearer " + props.token },
        body: JSON.stringify(),
      }
    )
      .then((r) => r.json())
      .then((res) => {
        this.setState({
          loading: false,
          token: props.token,
          data: res,
          question: res.elements[0].data.text,
          renderResp: "",
        });

        console.log(this.state.renderResp);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  render() {
    //const s = this.state.loading? "loading": "loaded"
    return (
      <div className="main" key="main">
        <div className="process">
          <Answer data={this.state.renderResp} />{" "}
          <FlowContent
            data={this.state.data}
            token={this.state.token}
            continueFlow={this.continueFlow}
            key={this.state.token}
            addAnswer={this.addAnswer}
          />{" "}
        </div>
        <div className="flows">
          <Flowprocess
            initFlow={this.initFlow}
            token={this.state.token}
            flow={this.state.process}
          />{" "}
        </div>
      </div>
    );
  }
}

export default App;
