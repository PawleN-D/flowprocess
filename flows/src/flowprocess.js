import React from "react";

// Destructuring props in the function arguments.
const Flowprocess = ({ initFlow, token, flow }) => {
  return (
    <div>
      <div className="inner-column">
        {flow.map(({ process, name, icon }) => (
          <div
            className="flow_process"
            key={process}
            onClick={() => initFlow({ process, token })}
          >
            <button className="">
              <div className="icon-wrapper">
                <img
                  src={
                    require("./icons/DataBalk-Klantprocessen_Contract-wijzigen.png")
                      .default
                  }
                  alt={"icon"}
                />
              </div>
              <div className="name">{name}</div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flowprocess;
