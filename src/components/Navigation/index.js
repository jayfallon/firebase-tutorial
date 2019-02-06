import React from "react";
import { Link } from "react-router-dom";
import NavStyles from "./NavStyles";
import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";
import { AuthUserContext } from "../Session";

const Navigation = ({ authUser }) => (
	<div>
		<AuthUserContext.Consumer>
			{authUser => (authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />)}
		</AuthUserContext.Consumer>
	</div>
);

const NavigationAuth = ({ authUser }) => (
	<NavStyles>
		<ul>
			<li>
				<Link to={ROUTES.LANDING}>Landing</Link>
			</li>
			<li>
				<Link to={ROUTES.HOME}>Home</Link>
			</li>
			<li>
				<Link to={ROUTES.ACCOUNT}>Account</Link>
			</li>
			{authUser.roles.includes(ROLES.ADMIN) && (
				<li>
					<Link to={ROUTES.ADMIN}>Admin</Link>
				</li>
			)}
			<li>
				<SignOutButton />
			</li>
		</ul>
	</NavStyles>
);
const NavigationNonAuth = () => (
	<NavStyles>
		<ul>
			<li>
				<Link to={ROUTES.SIGN_IN}>Sign In</Link>
			</li>
			<li>
				<Link to={ROUTES.LANDING}>Landing</Link>
			</li>
		</ul>
	</NavStyles>
);

export default Navigation;
