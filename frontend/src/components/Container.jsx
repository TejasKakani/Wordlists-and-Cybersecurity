
function Container({ children }) {
    
    return (
        <div className="px-5 py-5 lg:flex md:flex sm:grid justify-evenly">
            {children}
        </div>
  );
}

export default Container;