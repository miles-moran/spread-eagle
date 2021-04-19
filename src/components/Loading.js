import React from 'react'

const Loading = () => {
    return (
      <div
        style={{
          height: "100vh",
          backgroundColor: "#eeeeee",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="loader"></div>
      </div>
    );
  };
  
  export default Loading;
  

  ({ args:{list}}) => {
    return (
    <div>{list.map(l => <div>l</div>)}</div>
    )}