import * as React from 'react';
import {Button, Grid, Image, Header, Segment, Divider, Label} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import {Link} from 'react-router-dom';
import RequestModule from '../requests/RequestModule';
import {connect} from 'react-redux';
import {updateToken} from "../redux/actions/userActions";

class LoginForm extends React.Component<any, any> {

    constructor(props: string) {
        super(props);
        this.state = {
            username: "",
            password: "",
            token: "",
            showLabel: false
        };

        this.startEditing = this.startEditing.bind(this);
        this.onUpdateToken = this.onUpdateToken.bind(this);
    }

    componentDidMount() {
        RequestModule.getToken().then(token => {
            console.log("receive token =>" + token);
            this.setState({
                token: token
            });
        });
    }

    onUpdateToken (token: any) {
        this.props.onUpdateToken(token);
    }
    render() {
        const logo = require('../img/logo.png');
        console.log(this.props);
        return (
            <div className="login">
                <Grid
                    textAlign="center"
                    style={{height: '100%', marginTop: '2em'}}
                    verticalAlign="middle"
                >
                    <Grid.Column style={{maxWidth: 400}}>
                        <Header
                            as="h2"
                            inverted={true}
                            textAlign="center"
                            style={{
                                marginBottom: '1.5em'
                            }}
                        >
                            <Image src={logo}/>
                            {' '}Log-in to your account
                        </Header>
                        <Segment inverted={true}>
                            <Button.Group size='huge' fluid={true}>
                                <Button
                                    color="teal"
                                    inverted={true}
                                    size="huge"
                                    onClick={(event) => this.handleClick(event)}
                                    icon="github"
                                    content="Sign in"
                                />
                                <Button.Or/>
                                <Button
                                    inverted={true}
                                    size="huge"
                                    icon="signup"
                                    content="Sign up"
                                    as={Link}
                                    to="/signup"
                                />
                            </Button.Group>
                            <Divider horizontal={true} inverted={true}>
                                Authenticated?
                            </Divider>

                            <Button
                                icon="birthday"
                                fluid={true}
                                inverted={true}
                                size="huge"
                                content="Start editing"
                                onClick={this.startEditing}
                            />
                            <p> token => {this.props.token} </p>
                            {this.state.showLabel && (
                                <Label color='red' pointing='above'>Please authenticate first</Label>
                            )}
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )
            ;
    }

    handleClick(event: any) {
        let {token} = this.state;
        console.log(token);
        this.onUpdateToken(token);
        RequestModule.AuthWithToken(token);
    }

    startEditing(event: any) {
        let {token} = this.state;
        RequestModule.isAuthenticated(token).then(authenticated => {
            if (authenticated) {
                this.props.history.push("/user");
            } else {
                console.log('not authenticated');
                this.setState({
                    showLabel: true
                });
            }
        });
    }
}

const mapStateToProps = (state) => {
    return state;
};

const mapActionsToProps = {
    onUpdateToken: updateToken
};

const ConLoginForm = connect(mapStateToProps, mapActionsToProps)(LoginForm);
export default withRouter(ConLoginForm);
