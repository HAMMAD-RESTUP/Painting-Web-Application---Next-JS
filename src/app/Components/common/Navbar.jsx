"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  ShoppingBag,
  UserRound,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  LockKeyhole,
  Trash2,
  Minus,
  Plus,
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const closeDesktopTimer = useRef(null);

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price || 0) * (item.quantity || 1),
      0
    );
  }, [cartItems]);

  const loadCart = () => {
    if (typeof window === "undefined") return;

    try {
      const courseCart = JSON.parse(localStorage.getItem("courseCart") || "[]");
      setCartItems(Array.isArray(courseCart) ? courseCart : []);
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();

    window.addEventListener("courseCartUpdated", loadCart);
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("courseCartUpdated", loadCart);
      window.removeEventListener("storage", loadCart);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isCartOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isCartOpen]);

  const openDesktopMenu = (menuName) => {
    if (closeDesktopTimer.current) {
      clearTimeout(closeDesktopTimer.current);
    }

    setActiveDesktopMenu(menuName);
  };

  const scheduleCloseDesktopMenu = () => {
    if (closeDesktopTimer.current) {
      clearTimeout(closeDesktopTimer.current);
    }

    closeDesktopTimer.current = setTimeout(() => {
      setActiveDesktopMenu(null);
    }, 180);
  };

  const closeDesktopMenu = () => {
    if (closeDesktopTimer.current) {
      clearTimeout(closeDesktopTimer.current);
    }

    setActiveDesktopMenu(null);
  };

  const saveCart = (items) => {
    localStorage.setItem("courseCart", JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new Event("courseCartUpdated"));
  };

  const increaseQuantity = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );

    saveCart(updatedItems);
  };

  const decreaseQuantity = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) }
        : item
    );

    saveCart(updatedItems);
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    saveCart(updatedItems);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsShopOpen(false);
    setIsCoursesOpen(false);
  };

  const openCart = () => {
    loadCart();
    setIsCartOpen(true);
    closeMenu();
    closeDesktopMenu();
  };

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap");

        .shopify-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 11px 13px;
          border: none;
          background: transparent;
          color: #292724;
          cursor: pointer;
          font-family: "Jost", sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.12em;
          line-height: 1;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 180ms ease;
          white-space: nowrap;
        }

        .shopify-nav-link:hover {
          color: #a07f62;
        }

        .desktop-menu-group {
          position: relative;
        }

        .desktop-menu-group::after {
          content: "";
          position: absolute;
          left: -12px;
          right: -12px;
          top: 100%;
          height: 28px;
          background: transparent;
        }

        .dropdown-link {
          display: block;
          padding: 12px 13px;
          border-radius: 9px;
          color: #292724;
          font-family: "Jost", sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 180ms ease, color 180ms ease;
        }

        .dropdown-link:hover {
          background: #f7f4ef;
          color: #a07f62;
        }

        .navbar-icon-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          padding: 0;
          border: none;
          border-radius: 999px;
          background: transparent;
          color: #292724;
          cursor: pointer;
          text-decoration: none;
          transition:
            background 180ms ease,
            color 180ms ease;
        }

        .navbar-icon-btn:hover {
          background: #f6f4f1;
          color: #9a7657;
        }

        .cart-count {
          position: absolute;
          top: 1px;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          border: 1px solid #ffffff;
          border-radius: 999px;
          background: #a8876d;
          color: #ffffff;
          font-family: "Jost", sans-serif;
          font-size: 8px;
          font-weight: 700;
          line-height: 1;
        }

        .desktop-dropdown {
          position: absolute;
          top: calc(100% + 18px);
          left: 50%;
          z-index: 100;
          width: 230px;
          padding: 8px;
          border: 1px solid #ebe7e2;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.1);
          opacity: 0;
          pointer-events: none;
          transform: translateX(-50%) translateY(8px);
          transition:
            opacity 180ms ease,
            transform 180ms ease;
        }

        .desktop-dropdown.open {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }

        .shop-mega-menu {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0 24px;
          opacity: 0;
          pointer-events: none;
          transform: translateY(8px);
          transition:
            opacity 220ms ease,
            transform 220ms ease;
        }

        .shop-mega-menu.open {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        .mobile-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 90;
          max-height: 0;
          overflow: hidden;
          border-top: 1px solid transparent;
          background: #ffffff;
          opacity: 0;
          transition:
            max-height 360ms ease,
            opacity 240ms ease;
        }

        .mobile-panel.open {
          max-height: calc(100dvh - 72px);
          overflow-y: auto;
          border-top-color: #ebe7e2;
          opacity: 1;
        }

        .mobile-main-link,
        .mobile-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 15px 0;
          border: none;
          border-bottom: 1px solid #f0ede9;
          background: transparent;
          color: #292724;
          font-family: "Jost", sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.13em;
          text-align: left;
          text-decoration: none;
          text-transform: uppercase;
        }

        .mobile-sub-link {
          display: block;
          padding: 11px 0;
          color: #746c65;
          font-family: "Jost", sans-serif;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 180ms ease;
        }

        .mobile-sub-link:hover {
          color: #a07f62;
        }

        .drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 110;
          background: rgba(20, 18, 16, 0.38);
          opacity: 0;
          pointer-events: none;
          transition: opacity 280ms ease;
        }

        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 120;
          display: flex;
          width: min(460px, 100%);
          height: 100dvh;
          flex-direction: column;
          background: #ffffff;
          color: #292724;
          box-shadow: -18px 0 60px rgba(0, 0, 0, 0.12);
          transform: translateX(100%);
          transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .cart-drawer.open {
          transform: translateX(0);
        }

        .cart-item {
          display: grid;
          grid-template-columns: 74px 1fr;
          gap: 14px;
          padding: 16px 0;
          border-bottom: 1px solid #eeeae6;
        }

        .cart-item-image {
          width: 74px;
          height: 74px;
          overflow: hidden;
          border-radius: 14px;
          background: #f3f1ee;
        }

        .cart-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .qty-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: 1px solid #e5ddd5;
          border-radius: 999px;
          background: #ffffff;
          color: #292724;
          cursor: pointer;
          transition: background 180ms ease, color 180ms ease;
        }

        .qty-btn:hover {
          background: #292724;
          color: #ffffff;
        }

        .continue-shopping-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 14px 22px;
          border-radius: 999px;
          background: #292724;
          color: #ffffff;
          font-family: "Jost", sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-decoration: none;
          text-transform: uppercase;
          transition:
            background 200ms ease,
            transform 200ms ease;
        }

        .continue-shopping-btn:hover {
          background: #443d37;
          transform: translateY(-1px);
        }

        .checkout-btn {
          width: 100%;
          padding: 15px 18px;
          border: none;
          border-radius: 999px;
          background: #292724;
          color: #ffffff;
          cursor: pointer;
          font-family: "Jost", sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: background 180ms ease, transform 180ms ease;
        }

        .checkout-btn:hover {
          background: #a8876d;
          transform: translateY(-1px);
        }

        .checkout-btn.disabled {
          background: #d9d4cf;
          cursor: not-allowed;
        }

        @media (max-width: 1020px) {
          .desktop-navigation,
          .desktop-actions {
            display: none !important;
          }

          .mobile-actions {
            display: flex !important;
          }
        }

        @media (min-width: 1021px) {
          .mobile-actions {
            display: none !important;
          }
        }

        @media (max-width: 560px) {
          .navbar-inner {
            height: 72px !important;
            padding: 0 18px !important;
          }

          .shop-mega-menu {
            top: 72px;
          }
        }
      `}</style>

      <header
        onMouseLeave={scheduleCloseDesktopMenu}
        style={{
          position: "relative",
          zIndex: 70,
          background: "#ffffff",
          borderBottom: "1px solid #eeeae6",
        }}
      >
        <div
          className="navbar-inner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 80,
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 42px",
          }}
        >
          <Link
            href="/"
            onClick={() => {
              closeMenu();
              closeDesktopMenu();
            }}
            style={{ flexShrink: 0, textDecoration: "none" }}
          >
            <span
              style={{
                display: "block",
                color: "#292724",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 21,
                fontWeight: 400,
                letterSpacing: "0.18em",
                lineHeight: 1,
                textTransform: "uppercase",
              }}
            >
              Rakhshinda
            </span>

            <span
              style={{
                display: "block",
                marginTop: 5,
                color: "#a8876d",
                fontFamily: "'Jost', sans-serif",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.62em",
                lineHeight: 1,
                textTransform: "uppercase",
              }}
            >
              Art
            </span>
          </Link>

          <nav
            className="desktop-navigation"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              marginLeft: 34,
              marginRight: "auto",
            }}
          >
            <Link
              href="/collaborations"
              className="shopify-nav-link"
              onMouseEnter={closeDesktopMenu}
            >
              Collaborations
            </Link>

            <div
              className="desktop-menu-group"
              onMouseEnter={() => openDesktopMenu("shop")}
              onMouseLeave={scheduleCloseDesktopMenu}
            >
              <Link href="/shop" className="shopify-nav-link">
                Shop
                <ChevronDown size={13} strokeWidth={1.8} />
              </Link>

              <div
                className={`shop-mega-menu ${
                  activeDesktopMenu === "shop" ? "open" : ""
                }`}
                onMouseEnter={() => openDesktopMenu("shop")}
                onMouseLeave={scheduleCloseDesktopMenu}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "240px repeat(3, 1fr)",
                    gap: 24,
                    maxWidth: 1240,
                    margin: "0 auto",
                    padding: 24,
                    border: "1px solid #ebe7e2",
                    borderRadius: 16,
                    background: "#ffffff",
                    boxShadow: "0 20px 55px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "10px 6px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          color: "#a8876d",
                          fontFamily: "'Jost', sans-serif",
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                        }}
                      >
                        Shop Collection
                      </p>

                      <h3
                        style={{
                          margin: "14px 0 0",
                          color: "#292724",
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: 29,
                          fontWeight: 400,
                          lineHeight: 1.12,
                        }}
                      >
                        Art for meaningful spaces
                      </h3>

                      <p
                        style={{
                          margin: "13px 0 0",
                          color: "#756e68",
                          fontFamily: "'Jost', sans-serif",
                          fontSize: 13,
                          lineHeight: 1.7,
                        }}
                      >
                        Explore original paintings, refined prints and creative
                        kits.
                      </p>
                    </div>

                    <Link
                      href="/shop"
                      onClick={closeDesktopMenu}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        marginTop: 20,
                        color: "#292724",
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.15em",
                        textDecoration: "none",
                        textTransform: "uppercase",
                      }}
                    >
                      Shop All
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  <ShopCard
                    href="/shop/original-paintings"
                    image="/images/original-paintings.jpg"
                    title="Original Paintings"
                    onClick={closeDesktopMenu}
                  />

                  <ShopCard
                    href="/shop/prints"
                    image="/images/prints.jpg"
                    title="Fine Art Prints"
                    onClick={closeDesktopMenu}
                  />

                  <ShopCard
                    href="/shop/calligraphy-kit"
                    image="/images/calligraphy-kit.jpg"
                    title="Calligraphy Kit"
                    onClick={closeDesktopMenu}
                  />
                </div>
              </div>
            </div>

            <div
              className="desktop-menu-group"
              onMouseEnter={() => openDesktopMenu("courses")}
              onMouseLeave={scheduleCloseDesktopMenu}
            >
              <Link href="/courses" className="shopify-nav-link">
                Courses
                <ChevronDown size={13} strokeWidth={1.8} />
              </Link>

              <div
                className={`desktop-dropdown ${
                  activeDesktopMenu === "courses" ? "open" : ""
                }`}
                onMouseEnter={() => openDesktopMenu("courses")}
                onMouseLeave={scheduleCloseDesktopMenu}
              >
                <Link
                  href="/courses"
                  className="dropdown-link"
                  onClick={closeDesktopMenu}
                >
                  View All Courses
                </Link>

                <Link
                  href="/courses?category=islamic-geometry"
                  className="dropdown-link"
                  onClick={closeDesktopMenu}
                >
                  Islamic Geometry
                </Link>

                <Link
                  href="/courses?category=painting-workshop"
                  className="dropdown-link"
                  onClick={closeDesktopMenu}
                >
                  Painting
                </Link>

                <Link
                  href="/courses?category=arabic-calligraphy"
                  className="dropdown-link"
                  onClick={closeDesktopMenu}
                >
                  Arabic Calligraphy
                </Link>
              </div>
            </div>

            <Link
              href="/artist"
              className="shopify-nav-link"
              onMouseEnter={closeDesktopMenu}
            >
              Artist
            </Link>

            <Link
              href="/faqs"
              className="shopify-nav-link"
              onMouseEnter={closeDesktopMenu}
            >
              FAQs
            </Link>

            <Link
              href="/contact"
              className="shopify-nav-link"
              onMouseEnter={closeDesktopMenu}
            >
              Contact
            </Link>
          </nav>

          <div
            className="desktop-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <button
              type="button"
              className="navbar-icon-btn"
              aria-label="Search"
              onMouseEnter={closeDesktopMenu}
            >
              <Search size={19} strokeWidth={1.6} />
            </button>

            <Link
              href="/login"
              className="navbar-icon-btn"
              aria-label="Account"
              onMouseEnter={closeDesktopMenu}
            >
              <UserRound size={18} strokeWidth={1.6} />
            </Link>

            <button
              type="button"
              onClick={openCart}
              onMouseEnter={closeDesktopMenu}
              className="navbar-icon-btn"
              aria-label="Open cart"
            >
              <ShoppingBag size={19} strokeWidth={1.6} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>

          <div
            className="mobile-actions"
            style={{
              alignItems: "center",
              gap: 4,
            }}
          >
            <button
              type="button"
              onClick={openCart}
              className="navbar-icon-btn"
              aria-label="Open cart"
            >
              <ShoppingBag size={19} strokeWidth={1.6} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="navbar-icon-btn"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={22} strokeWidth={1.7} />
              ) : (
                <Menu size={23} strokeWidth={1.7} />
              )}
            </button>
          </div>
        </div>

        <div className={`mobile-panel ${isMenuOpen ? "open" : ""}`}>
          <div style={{ padding: "5px 20px 28px" }}>
            <Link
              href="/collaborations"
              className="mobile-main-link"
              onClick={closeMenu}
            >
              Collaborations
            </Link>

            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setIsShopOpen((prev) => !prev)}
            >
              Shop
              <ChevronDown
                size={16}
                style={{
                  transform: isShopOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 220ms ease",
                }}
              />
            </button>

            <div
              style={{
                maxHeight: isShopOpen ? 220 : 0,
                overflow: "hidden",
                paddingLeft: 14,
                opacity: isShopOpen ? 1 : 0,
                transition: "max-height 280ms ease, opacity 220ms ease",
              }}
            >
              <Link href="/shop" className="mobile-sub-link" onClick={closeMenu}>
                Shop All
              </Link>

              <Link
                href="/shop/original-paintings"
                className="mobile-sub-link"
                onClick={closeMenu}
              >
                Original Paintings
              </Link>

              <Link
                href="/shop/prints"
                className="mobile-sub-link"
                onClick={closeMenu}
              >
                Fine Art Prints
              </Link>

              <Link
                href="/shop/calligraphy-kit"
                className="mobile-sub-link"
                onClick={closeMenu}
              >
                Calligraphy Kit
              </Link>
            </div>

            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setIsCoursesOpen((prev) => !prev)}
            >
              Courses
              <ChevronDown
                size={16}
                style={{
                  transform: isCoursesOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 220ms ease",
                }}
              />
            </button>

            <div
              style={{
                maxHeight: isCoursesOpen ? 220 : 0,
                overflow: "hidden",
                paddingLeft: 14,
                opacity: isCoursesOpen ? 1 : 0,
                transition: "max-height 280ms ease, opacity 220ms ease",
              }}
            >
              <Link
                href="/courses"
                className="mobile-sub-link"
                onClick={closeMenu}
              >
                View All Courses
              </Link>

              <Link
                href="/courses?category=islamic-geometry"
                className="mobile-sub-link"
                onClick={closeMenu}
              >
                Islamic Geometry
              </Link>

              <Link
                href="/courses?category=painting-workshop"
                className="mobile-sub-link"
                onClick={closeMenu}
              >
                Painting
              </Link>

              <Link
                href="/courses?category=arabic-calligraphy"
                className="mobile-sub-link"
                onClick={closeMenu}
              >
                Arabic Calligraphy
              </Link>
            </div>

            <Link href="/about" className="mobile-main-link" onClick={closeMenu}>
              Artist
            </Link>

            <Link href="/faq" className="mobile-main-link" onClick={closeMenu}>
              FAQs
            </Link>

            <Link
              href="/contact"
              className="mobile-main-link"
              onClick={closeMenu}
            >
              Contact
            </Link>

            <Link href="/login" className="mobile-main-link" onClick={closeMenu}>
              Account
              <UserRound size={17} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </header>

      <div
        className={`drawer-overlay ${isCartOpen ? "open" : ""}`}
        onClick={() => setIsCartOpen(false)}
      />

      <aside
        className={`cart-drawer ${isCartOpen ? "open" : ""}`}
        aria-hidden={!isCartOpen}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 78,
            padding: "0 24px",
            borderBottom: "1px solid #eeeae6",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#292724",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 25,
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              Your Cart
            </h2>

            <p
              style={{
                margin: "7px 0 0",
                color: "#8b837b",
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="navbar-icon-btn"
            aria-label="Close cart"
          >
            <X size={21} strokeWidth={1.7} />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: cartItems.length > 0 ? "8px 24px 24px" : "42px 28px",
          }}
        >
          {cartItems.length === 0 ? (
            <div
              style={{
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  background: "#f7f5f2",
                  color: "#625a53",
                }}
              >
                <ShoppingBag size={29} strokeWidth={1.25} />
              </div>

              <p
                style={{
                  maxWidth: 300,
                  margin: "22px 0 0",
                  color: "#736b64",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.8,
                }}
              >
                Your cart is currently empty. Add a course to start learning.
              </p>

              <Link
                href="/courses"
                onClick={() => setIsCartOpen(false)}
                className="continue-shopping-btn"
                style={{ marginTop: 25 }}
              >
                Explore Courses
                <ArrowRight size={14} strokeWidth={1.8} />
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.title} />
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: "#292724",
                          fontFamily: "'Jost', sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.title}
                      </h3>

                      <p
                        style={{
                          margin: "5px 0 0",
                          color: "#8b837b",
                          fontFamily: "'Jost', sans-serif",
                          fontSize: 11,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.category}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="qty-btn"
                      aria-label="Remove item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        className="qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>

                      <span
                        style={{
                          minWidth: 18,
                          textAlign: "center",
                          color: "#292724",
                          fontFamily: "'Jost', sans-serif",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {item.quantity || 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        className="qty-btn"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <strong
                      style={{
                        color: "#292724",
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      AED {Number(item.price || 0) * (item.quantity || 1)}
                    </strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            padding: "20px 24px 22px",
            borderTop: "1px solid #eeeae6",
            background: "#fcfbfa",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              color: "#292724",
              fontFamily: "'Jost', sans-serif",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span>Subtotal</span>
            <span>AED {subtotal}</span>
          </div>

          {cartItems.length > 0 ? (
            <Link
              href="/cart"
              onClick={() => setIsCartOpen(false)}
              className="checkout-btn"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              View Cart
            </Link>
          ) : (
            <button type="button" className="checkout-btn disabled" disabled>
              Checkout
            </button>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginTop: 14,
              color: "#928a82",
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              letterSpacing: "0.04em",
            }}
          >
            <LockKeyhole size={13} strokeWidth={1.6} />
            Secure checkout
          </div>
        </div>
      </aside>
    </>
  );
}

function ShopCard({ href, image, title, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: "block",
        color: "#292724",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          height: 180,
          overflow: "hidden",
          borderRadius: 12,
          background: "#f3f1ee",
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 500ms ease",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "scale(1)";
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          paddingTop: 11,
        }}
      >
        <h4
          style={{
            margin: 0,
            color: "#292724",
            fontFamily: "'Jost', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h4>

        <ArrowRight size={14} strokeWidth={1.7} />
      </div>
    </Link>
  );
}