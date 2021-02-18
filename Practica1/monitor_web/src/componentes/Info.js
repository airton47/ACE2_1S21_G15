import React, { Component } from 'react';

class Info extends Component{

    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        fetch("http://ec2-3-16-13-115.us-east-2.compute.amazonaws.com/tests/")
          .then(res => res.json())
          .then(
            (json) => {
              this.setState({
                isLoaded: true,
                items: json
              });
            },
            // Nota: es importante manejar errores aquí y no en 
            // un bloque catch() para que no interceptemos errores
            // de errores reales en los componentes.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
      }

    render(){
        const { error, isLoaded, items } = this.state;
        if (error) {
        return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
        return <div>Loading...</div>;
        } else {
            return (
                <ul>
                {items.map(item => (
                    <li key={item._id}>
                    ID: {item._id} |VVALOR: {item.valor} | CREACION: {item.createdAt}
                    </li>
                ))}
                </ul>
            );
        }        
    }
}

export default Info;