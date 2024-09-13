
function Buttons({ buttonName = [], buttonClasses = [], buttonOnclick = [] }) {
 
    return (
        <>
        {buttonName.map((name, index) => (
            <button className={buttonClasses[index]} onClick={buttonOnclick[index]} key={index}>{name}</button>
        ))}
        </>
    )
  
}

export default Buttons;