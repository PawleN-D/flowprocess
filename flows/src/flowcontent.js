import React, { useEffect } from "react";
import { FlowStore } from "./flowStore.js";
import { SDK } from "./sdkInit";
import { Stack, IStackTokens } from "@fluentui/react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Label } from "@fluentui/react/lib/Label";
import { TextField } from "@fluentui/react/lib/TextField";
import { IconButton } from "@fluentui/react/lib/Button";
import { initializeIcons } from "@fluentui/font-icons-mdl2";

initializeIcons();

function _submitForm(e, token, id, callback, setObject) {
  e.preventDefault();
  console.log(e.target.length);
  var data1 = "";
  var separator = "";

  if (e.target.length > 1) {
    for (var i = 0; i < e.target.length - 1; i++) {
      data1 =
        data1 +
        separator +
        '"' +
        e.target[i].id +
        '": "' +
        e.target[i].value +
        '"';
      separator = ",";
    }
    data1 = "{" + data1 + " }";
  } else {
    data1 = "{}";
  }
  console.log("data from submit:");
  console.log(data1);

  callback(data1, token, id);
}

function FlowContent(props) {
  const credentials = {
    appKey: "D167BC13-0848-4A8A-9823-9D8B9DACE899",
    secret: "xs4crm@iris",
  };
  SDK.client.auth.appLogin(credentials).then((res) => {
    console.log(res);
  });

  const flowStore = new FlowStore();
  const instanceID = "BP_Reparatieverzoek";

  useEffect(() => {
    if (instanceID)
      flowStore.onFlowInit(true, { instanceID: instanceID, values: {} });
  }, [instanceID]);

  const backFlow = (id, screen) => {
    flowStore.onFlowBackAction(id);
  };
  const initValues = (elements) => {
    var obj = Object.fromEntries(
      elements !== null && elements !== undefined
        ? elements.map((e) => {
            return [e.data.outputKey, ""];
          })
        : []
    );
    delete obj["undefined"];
    delete obj["/"];
    return obj ? obj : {};
  };
  // const [theArrayOfObjects, setTheArrayOfObjects] = useState("");
  const handleChangeArrayAddObject1 = (event) => {
    event.preventDefault();
    const value = event.target[0].value;

    // console.log(value);

    // console.log("handleChangeAddAddObject: ", value);
    props.addAnswer(value);
  };

  const handleChangeArrayAddObject = (event) => {
    event.preventDefault();
    const value = event.target.value;

    console.log(value);

    // console.log("handleChangeAddAddObject: ", value);
    props.addAnswer(value);
  };
  //console.log(props);
  //const { IIconProps, IContextualMenuProps, Stack, Link, IconButton, ThemeProvider, initializeIcons } = window.FluentUIReact;
  const stackTokens = { childrenGap: 5 };
  const stackStyles = { root: {} };
  // const stackButtonStyles: Partial<IStackStyles> = { root: { width: 230 } };
  const nextIcon = { iconName: "DoubleChevronRight8" };
  const firstStackStyles = {
    root: {},
  };
  const containerStackStyles = {
    root: {},
  };
  const textStyles = {
    width: 240,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const stackItemStyles = {
    ...textStyles,
  };

  const elements = props.data.elements;
  const token = props.token;
  const id = props.data.ID;
  const continueFlow = props.continueFlow;
  let listItems = "loading...";
  let tempContent = "";
  if (elements !== undefined) {
    var thereIsButton = elements.some((element) => element.type === "select");
    // console.log("thereIsButton:" + thereIsButton);

    // eslint-disable-next-line array-callback-return
    tempContent = elements.map((element) => {
      if (element.type === "display") {
        return (
          <div className="main-text">
            <Label key={element.data.text}>{element.data.text}</Label>
          </div>
        );
      }
      if (element.type === "select") {
        let options = element.data.list;
        let outputKey = element.data.outputKey;
        return (
          <Stack
            wrap
            tokens={stackTokens}
            styles={containerStackStyles}
            key="buttons"
          >
            <Stack
              wrap
              horizontal
              tokens={stackTokens}
              styles={firstStackStyles}
              key="buttons"
            >
              {options.map((option, i) => (
                <PrimaryButton
                  key={i}
                  value={option.value}
                  style={stackItemStyles}
                  text={option.text}
                  onClick={(e) => {
                    handleChangeArrayAddObject(e);
                    continueFlow(
                      '{"' + outputKey + '":"' + option.value + '"}',
                      token,
                      id
                    );
                  }}
                />
              ))}
            </Stack>
          </Stack>
        );
      }
      if (element.type === "input") {
        return (
          <Stack
            horizontal
            tokens={stackTokens}
            styles={stackStyles}
            key={element.data.outputKey + "_stack"}
          >
            <TextField
              className="vraag"
              label=""
              name={element.data.outputKey}
              id={element.data.outputKey}
              key={element.data.outputKey}
            />
          </Stack>
        );
      }
    });

    if (!thereIsButton) {
      listItems = (
        <Stack horizontal tokens={stackTokens} styles={stackStyles}>
          <form
            onSubmit={(e) => {
              handleChangeArrayAddObject1(e);
              _submitForm(e, token, id, continueFlow);
            }}
          >
            {tempContent}
            <IconButton
              iconProps={nextIcon}
              title="Next"
              ariaLabel="Next"
              type="submit"
            />
          </form>
        </Stack>
      );
    } else {
      listItems = (
        <Stack wrap tokens={stackTokens} styles={stackStyles}>
          {tempContent}
        </Stack>
      );
    }
  } else {
    listItems = <Label disabled>Flow is bij een eindpunt gekomen</Label>;
  }

  return (
    <div key="flow-contanier">
      <div className="tempcont">{listItems}</div>
    </div>
  );
}

export default FlowContent;
