import { Link, NavLink } from "react-router-dom"
export const Header = () => {
        return (
            <div>
               <NavLink to="/collections" className={({isActive}) => `${isActive ? "underline text-red-600" : "text-white"}`}>Card collections</NavLink>
            </div>
        )
}