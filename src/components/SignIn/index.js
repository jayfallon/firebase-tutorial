import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";

import { PasswordForgetLink } from "../PasswordForget";
import { SignUpLink } from "../SignUp";

import * as ROUTES from "../../constants/routes";

const SignInPage = () => (
	<div>
		<h2>Sign In Page</h2>
		<SignInForm />
		<SignInGoogle />
		<SignInFacebook />
		<SignInTwitter />
		<PasswordForgetLink />
		<SignUpLink />
	</div>
);

const INITIAL_STATE = {
	email: "",
	password: "",
	error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = `
	An account with an Email address to this social account already exists. try to login from this account instead and associate your social accounts on your personal account page
`;

class SignInFormBase extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		const { email, password } = this.state;

		this.props.firebase
			.doSignInWithEmailAndPassword(email, password)
			.then(() => {
				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				this.setState({ error });
			});

		event.preventDefault();
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email, password, error } = this.state;

		const isInvalid = password === "" || email === "";

		return (
			<form onSubmit={this.onSubmit}>
				<input type="text" name="email" value={email} onChange={this.onChange} placeholder="Email Address" />
				<input
					type="password"
					name="password"
					value={password}
					onChange={this.onChange}
					placeholder="Password"
				/>
				<button disabled={isInvalid}>Sign In</button>

				{error && <p>{error.message}</p>}
			</form>
		);
	}
}

class SignInGoogleBase extends Component {
	constructor(props) {
		super(props);

		this.state = { error: null };
	}

	onSubmit = event => {
		this.props.firebase
			.doSignInWithGoogle()
			.then(socialAuthUser => {
				// Creat a user in your firebase realtime database too
				return this.props.firebase.user(socialAuthUser.user.uid).set({
					username: socialAuthUser.user.displayName,
					email: socialAuthUser.user.email,
					roles: [],
				});
			})
			.then(() => {
				this.setState({ error: null });
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
					error.message = ERROR_MSG_ACCOUNT_EXISTS;
				}

				this.setState({ error });
			});

		event.preventDefault();
	};

	render() {
		const { error } = this.state;

		return (
			<form onSubmit={this.onSubmit}>
				<button type="submit">Sign In With Google</button>

				{error && <p>{error.message}</p>}
			</form>
		);
	}
}

class SignInFacebookBase extends Component {
	constructor(props) {
		super(props);

		this.state = { error: null };
	}

	onSubmit = event => {
		this.props.firebase
			.doSignInWithFacebook()
			.then(socialAuthUser => {
				// Create a user in your Firebase Realtime Database too
				return this.props.firebase.user(socialAuthUser.user.uid).set({
					username: socialAuthUser.additionalUserInfo.profile.name,
					email: socialAuthUser.additionalUserInfo.profile.email,
					roles: [],
				});
			})
			.then(() => {
				this.setState({ error: null });
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
					error.message = ERROR_MSG_ACCOUNT_EXISTS;
				}

				this.setState({ error });
			});
		event.preventDefault();
	};

	render() {
		const { error } = this.state;

		return (
			<form onSubmit={this.onSubmit}>
				<button type="submit">Sign In With Facebook</button>

				{error && <p>{error.message}</p>}
			</form>
		);
	}
}

class SignInTwitterBase extends Component {
	constructor(props) {
		super(props);

		this.state = { error: null };
	}

	onSubmit = event => {
		this.props.firebase
			.doSignInWithTwitter()
			.then(socialAuthUser => {
				// Create a user in your Firebase Realtime Database too
				return this.props.firebase.user(socialAuthUser.user.uid).set({
					username: socialAuthUser.additionalUserInfo.profile.name,
					email: socialAuthUser.additionalUserInfo.profile.email,
					roles: [],
				});
			})
			.then(() => {
				this.setState({ error: null });
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
					error.message = ERROR_MSG_ACCOUNT_EXISTS;
				}

				this.setState({ error });
			});
		event.preventDefault();
	};

	render() {
		const { error } = this.state;

		return (
			<form onSubmit={this.onSubmit}>
				<button type="submit">Sign In With Twitter</button>

				{error && <p>{error.message}</p>}
			</form>
		);
	}
}

const SignInForm = compose(
	withRouter,
	withFirebase
)(SignInFormBase);

const SignInGoogle = compose(
	withRouter,
	withFirebase
)(SignInGoogleBase);

const SignInFacebook = compose(
	withRouter,
	withFirebase
)(SignInFacebookBase);

const SignInTwitter = compose(
	withRouter,
	withFirebase
)(SignInTwitterBase);

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter };
