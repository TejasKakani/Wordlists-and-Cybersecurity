
function Container({ children }) {
    
    return (
        <div className="p-5 md:flex justify-evenly">
            {children}
        </div>
  );
}

export default Container;