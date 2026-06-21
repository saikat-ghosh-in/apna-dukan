import { Link, useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@mui/material";
import { FiShoppingCart } from "react-icons/fi";
import {
    MdAdminPanelSettings, MdStorefront, MdMenu, MdClose,
    MdPerson, MdShoppingBag, MdHome, MdGridView,
} from "react-icons/md";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logOutUser } from "../reduxStore/actions/authActions";
import { isTokenExpired } from "../utils/tokenManager";
import profilePlaceholderImage from "../assets/profile-placeholder.png";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const user = useSelector((state) => state.auth?.user);
    const userDetails = useSelector((state) => state.auth?.userDetails);
    const itemCount = useSelector((state) => state.cartDetails?.cartQty || 0);

    const imageSrc = userDetails?.profileImageUrl ?? profilePlaceholderImage;
    const isTokenValid = user?.token && !isTokenExpired(user.tokenExpirationTime);
    const isLoggedIn = Boolean(user && isTokenValid);

    const path = location.pathname.toLowerCase();
    const hideLogin = path.startsWith("/login") || path.startsWith("/register");
    const hideCart = path.startsWith("/cart");

    const freeShippingAbove = import.meta.env.VITE_FREE_SHIPPING_ABOVE || 999;

    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user?.roles?.includes("ROLE_SELLER");

    const initials = userDetails?.firstName
        ? `${userDetails.firstName[0]}${userDetails.lastName?.[0] ?? ""}`.toUpperCase()
        : user?.username?.[0]?.toUpperCase() ?? "U";

    const displayName = userDetails
        ? [userDetails.firstName, userDetails.lastName].filter(Boolean).join(" ") || user?.username
        : user?.username;

    const isActive = (href) => path === href.toLowerCase();

    const handleLogout = () => {
        setMenuOpen(false);
        setMobileOpen(false);
        dispatch(logOutUser(navigate));
    };

    const goTo = (route) => {
        setMenuOpen(false);
        setMobileOpen(false);
        navigate(route);
    };

    const NavLink = ({ to, children }) => (
        <Link
            to={to}
            className={`text-sm font-medium transition-colors ${isActive(to) ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                }`}
        >
            {children}
        </Link>
    );

    const profileLinks = [
        { label: "My Profile", icon: MdPerson, route: "/profile" },
        { label: "My Orders", icon: MdShoppingBag, route: "/orders" },
        { label: "My Cart", icon: FiShoppingCart, route: "/cart" },
        ...(isAdmin ? [{ label: "Admin Panel", icon: MdAdminPanelSettings, route: "/admin/dashboard" }] : []),
        ...(isSeller ? [{ label: "My Store", icon: MdStorefront, route: "/seller/dashboard" }] : []),
    ];

    return (
        <>
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

                    {/* Brand */}
                    <div
                        className="flex items-center gap-2.5 min-w-fit cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => goTo("/")}
                    >
                        <div className="h-8 w-8 rounded-full overflow-hidden shrink-0">
                            <img src="/logo.jpg" alt="Mercato Logo" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-sm font-bold text-slate-900 tracking-tight">Mercato</span>
                    </div>

                    {/* Marquee — hidden on mobile */}
                    <div className="flex-1 overflow-hidden hidden md:block">
                        <p className="animate-marquee whitespace-nowrap text-xs text-slate-500">
                            🚚 Free shipping on orders above ₹{freeShippingAbove} &nbsp;•&nbsp;
                            🔁 Easy 7-day returns &nbsp;•&nbsp;
                            💳 Secure payments guaranteed &nbsp;•&nbsp;
                            ✨ New arrivals every week
                        </p>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-5 min-w-fit">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/products">Products</NavLink>

                        {/* Cart */}
                        {!hideCart && (
                            <button
                                onClick={() => goTo("/cart")}
                                className="relative cursor-pointer text-slate-600 hover:text-slate-900 transition-colors"
                                aria-label="Shopping cart"
                            >
                                <Badge badgeContent={itemCount} max={9} color="info">
                                    <FiShoppingCart size={20} />
                                </Badge>
                            </button>
                        )}

                        {/* Auth */}
                        {!isLoggedIn ? (
                            !hideLogin && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => goTo("/login")}
                                        className="px-4 py-1.5 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => goTo("/register")}
                                        className="px-4 py-1.5 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                                    >
                                        Register
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(v => !v)}
                                    className="flex items-center gap-2 cursor-pointer group"
                                    aria-label="Open profile menu"
                                >
                                    {isAdmin && (
                                        <span className="flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                                            <MdAdminPanelSettings size={11} /> Admin
                                        </span>
                                    )}
                                    {!isAdmin && isSeller && (
                                        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                                            <MdStorefront size={11} /> Seller
                                        </span>
                                    )}
                                    <img
                                        src={imageSrc}
                                        alt={displayName}
                                        className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-blue-300 transition-all"
                                        onError={(e) => {
                                            if (e.target.src !== profilePlaceholderImage) {
                                                e.target.src = profilePlaceholderImage;
                                            } else {
                                                const div = document.createElement("div");
                                                div.className = "h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-200";
                                                div.textContent = initials;
                                                e.target.replaceWith(div);
                                            }
                                        }}
                                    />
                                </button>

                                {/* Desktop dropdown */}
                                {menuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                        <div className="absolute right-0 top-10 z-20 w-56 bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden">
                                            <div className="px-4 py-3 border-b border-slate-100">
                                                <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                                                <div className="flex gap-1.5 mt-2 flex-wrap">
                                                    {(user?.roles ?? []).map(role => {
                                                        const map = {
                                                            ROLE_ADMIN: "bg-purple-50 text-purple-700 border-purple-100",
                                                            ROLE_SELLER: "bg-amber-50 text-amber-700 border-amber-100",
                                                            ROLE_USER: "bg-blue-50 text-blue-700 border-blue-100",
                                                        };
                                                        const label = role.replace("ROLE_", "").charAt(0) + role.replace("ROLE_", "").slice(1).toLowerCase();
                                                        return (
                                                            <span key={role} className={`text-[10px] font-semibold border px-1.5 py-0.5 rounded-full ${map[role] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
                                                                {label}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="py-1">
                                                {profileLinks.map(({ label, route }) => (
                                                    <button
                                                        key={route}
                                                        onClick={() => goTo(route)}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="border-t border-slate-100 py-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </nav>

                    {/* Mobile right side */}
                    <div className="flex md:hidden items-center gap-3">
                        {/* Cart icon on mobile */}
                        {!hideCart && (
                            <button
                                onClick={() => goTo("/cart")}
                                className="relative cursor-pointer text-slate-600"
                                aria-label="Shopping cart"
                            >
                                <Badge badgeContent={itemCount} max={9} color="info">
                                    <FiShoppingCart size={20} />
                                </Badge>
                            </button>
                        )}
                        {/* Burger */}
                        <button
                            onClick={() => setMobileOpen(v => !v)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                            aria-label="Open menu"
                        >
                            {mobileOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="fixed top-14 left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-xl md:hidden">

                        {/* User info strip */}
                        {isLoggedIn && (
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                                <img
                                    src={imageSrc}
                                    alt={displayName}
                                    className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200 shrink-0"
                                    onError={e => { e.target.src = profilePlaceholderImage; }}
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                </div>
                                {isAdmin && (
                                    <span className="ml-auto text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full shrink-0">
                                        Admin
                                    </span>
                                )}
                                {!isAdmin && isSeller && (
                                    <span className="ml-auto text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full shrink-0">
                                        Seller
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Nav links */}
                        <div className="px-3 py-2">
                            {[
                                { label: "Home", icon: MdHome, route: "/" },
                                { label: "Products", icon: MdGridView, route: "/products" },
                            ].map(({ label, icon: Icon, route }) => (
                                <button
                                    key={route}
                                    onClick={() => goTo(route)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${isActive(route)
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    <Icon size={17} />
                                    {label}
                                </button>
                            ))}

                            {/* Auth links */}
                            {isLoggedIn ? (
                                <>
                                    <div className="h-px bg-slate-100 my-2" />
                                    {profileLinks.map(({ label, icon: Icon, route }) => (
                                        <button
                                            key={route}
                                            onClick={() => goTo(route)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                        >
                                            <Icon size={17} />
                                            {label}
                                        </button>
                                    ))}
                                    <div className="h-px bg-slate-100 my-2" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : !hideLogin && (
                                <>
                                    <div className="h-px bg-slate-100 my-2" />
                                    <div className="flex gap-2 px-3 py-2">
                                        <button
                                            onClick={() => goTo("/login")}
                                            className="flex-1 py-2 text-sm font-medium border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => goTo("/register")}
                                            className="flex-1 py-2 text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors cursor-pointer"
                                        >
                                            Register
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="h-3" />
                    </div>
                </>
            )}
        </>
    );
};

export default Header;