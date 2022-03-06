import "./index.css";

function Button(props) {
  return (
    <button className={`calc-button ${ props.btnClass ? props.btnClass : '' }`}
            onClick={() => props.click(props.label)}>
      {props.label}
    </button>
  )
}

export default Button;