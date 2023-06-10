import classess from "./buttonLoader.module.css"

function Buttonloader() {
  return (
    <div className={classess.btn_loader}>
      <div className={classess.one}></div>
      <div className={classess.two}></div>
      <div className={classess.three}></div>
      <div className={classess.four}></div>
      <div className={classess.five}></div>
  </div>
  )
}

export default Buttonloader