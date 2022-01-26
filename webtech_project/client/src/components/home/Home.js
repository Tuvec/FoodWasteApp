import { Button } from 'primereact/button';
import React from 'react'
import './Home.css'

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickCreateAccount = () => {
            this.props.history.push('/create-account');
        }

        this.handleClickSignIn = () => {
            this.props.history.push('/sign-in');
        }
    }

    render() {
        return (
            <>
                <h1>Anti Food Waste App</h1>
                <div>
                    <div>
                        <Button label="Create account" onClick={this.handleClickCreateAccount} />
                        <Button label="Sign in" onClick={this.handleClickSignIn} />
                    </div>
                </div>
            </>
        )
    }
}

export default Home;