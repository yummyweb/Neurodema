import React from "react"

function Input({ state, setState, placeholder, isImei }) {
  return (
    <div className="input-box">
      <input type="text" value={state} onChange={e => isImei ? setState(e.target.value.replace(/\D/,'')) : setState(e.target.value)} className="input-text" placeholder={placeholder} />
    </div>
  );
}

export default Input;
