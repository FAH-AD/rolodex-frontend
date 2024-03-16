import "./style.css";

type props = {
  number: number;
};

export const NumIcon = ({ number }: props) => {
  return (<div className="circle">
    <span className="number">{number}</span>
  </div>)
};
