"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  ArrowRight,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { api } from "../../lib/api";

import {
  CART_EVENT,
  CART_STORAGE_KEY,
  readCart,
  removeCartItem as removeLocalCartItem,
  updateCartItemQuantity,
} from "../../lib/localCart";

import {
  useActiveCategories,
} from "../../hooks/useCategories";

const AUTH_QUERY_KEY = [
  "auth",
  "me",
];

/*
|--------------------------------------------------------------------------
| Response Helpers
|--------------------------------------------------------------------------
*/

const extractUser = (payload) => {
  const candidates = [
    payload?.data?.user,
    payload?.user,
    payload?.data,
    payload,
  ];

  return (
    candidates.find(
      (value) =>
        value &&
        typeof value ===
          "object" &&
        !Array.isArray(value) &&
        (
          value?._id ||
          value?.id ||
          value?.email
        ),
    ) || null
  );
};

const extractCategories = (
  payload,
) => {
  if (
    Array.isArray(
      payload?.data?.categories,
    )
  ) {
    return payload.data.categories;
  }

  if (
    Array.isArray(
      payload?.data,
    )
  ) {
    return payload.data;
  }

  if (
    Array.isArray(
      payload?.categories,
    )
  ) {
    return payload.categories;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
};

/*
|--------------------------------------------------------------------------
| Category Helpers
|--------------------------------------------------------------------------
*/

const getCategoryId = (
  category,
) => {
  return String(
    category?._id ||
      category?.id ||
      "",
  );
};

const getCategoryTitle = (
  category,
) => {
  return (
    category?.title ||
    category?.name ||
    "Collection"
  );
};

const getCategoryImage = (
  category,
) => {
  return (
    category?.image?.url ||
    category?.thumbnail?.url ||
    category?.imageUrl ||
    (
      typeof category?.image ===
      "string"
        ? category.image
        : ""
    ) ||
    (
      typeof category?.thumbnail ===
      "string"
        ? category.thumbnail
        : ""
    ) ||
    ""
  );
};

const isPaintingCategory = (
  category,
) => {
  const type = String(
    category?.type || "",
  ).toLowerCase();

  return [
    "painting",
    "shop",
    "product",
  ].includes(type);
};

const isCourseCategory = (
  category,
) => {
  return (
    String(
      category?.type || "",
    ).toLowerCase() ===
    "course"
  );
};

/*
|--------------------------------------------------------------------------
| Cart Helpers
|--------------------------------------------------------------------------
*/

const isPaintingCartItem = (
  item,
) => {
  return (
    String(
      item?.itemType || "",
    ).toLowerCase() !==
    "course"
  );
};

const getCartItemId = (
  item,
) => {
  return String(
    item?.paintingId ||
      item?._id ||
      item?.id ||
      "",
  );
};

const getCartItemTitle = (
  item,
) => {
  return (
    item?.title ||
    item?.painting?.title ||
    "Original Artwork"
  );
};

const getCartItemImage = (
  item,
) => {
  return (
    item?.image?.url ||
    item?.painting?.image?.url ||
    item?.painting?.thumbnail
      ?.url ||
    item?.painting?.images?.[0]
      ?.url ||
    (
      typeof item?.image ===
      "string"
        ? item.image
        : ""
    ) ||
    ""
  );
};

const getCartItemPrice = (
  item,
) => {
  const value =
    item?.unitPrice ??
    item?.painting?.price ??
    0;

  const price = Number(value);

  return Number.isFinite(price)
    ? price
    : 0;
};

const formatMoney = (
  amount,
  currency = "AED",
) => {
  const value = Number(amount);

  return new Intl.NumberFormat(
    "en-AE",
    {
      style: "currency",

      currency: String(
        currency || "AED",
      ).toUpperCase(),

      currencyDisplay: "code",

      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(
    Number.isFinite(value)
      ? value
      : 0,
  );
};

/*
|--------------------------------------------------------------------------
| Navbar
|--------------------------------------------------------------------------
*/

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient =
    useQueryClient();

  const closeMenuTimer =
    useRef(null);

  const [
    desktopMenu,
    setDesktopMenu,
  ] = useState(null);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    mobileShopOpen,
    setMobileShopOpen,
  ] = useState(false);

  const [
    mobileCoursesOpen,
    setMobileCoursesOpen,
  ] = useState(false);

  const [
    mobileAccountOpen,
    setMobileAccountOpen,
  ] = useState(false);

  const [
    cartOpen,
    setCartOpen,
  ] = useState(false);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    searchValue,
    setSearchValue,
  ] = useState("");

  const [
    cartErrorMessage,
    setCartErrorMessage,
  ] = useState("");

  const [
    cartItems,
    setCartItems,
  ] = useState([]);

  const [
    cartReady,
    setCartReady,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */

  const {
    data: authResponse,
    isLoading: authLoading,
  } = useQuery({
    queryKey:
      AUTH_QUERY_KEY,

    queryFn: async () => {
      try {
        const response =
          await api.get(
            "/auth/me",
          );

        return response.data;
      } catch (error) {
        if (
          error?.response
            ?.status === 401
        ) {
          return null;
        }

        throw error;
      }
    },

    retry: false,

    staleTime:
      30 * 1000,

    refetchOnWindowFocus:
      true,
  });

  const user = useMemo(() => {
    return extractUser(
      authResponse,
    );
  }, [authResponse]);

  const userName =
    user?.fullName ||
    user?.name ||
    "My Account";

  useEffect(() => {
    if (
      typeof window ===
        "undefined" ||
      authLoading
    ) {
      return;
    }

    if (user) {
      localStorage.setItem(
        "art_store_authenticated",
        "true",
      );
    } else {
      localStorage.removeItem(
        "art_store_authenticated",
      );
    }
  }, [
    user,
    authLoading,
  ]);

  const logoutMutation =
    useMutation({
      mutationFn: async () => {
        const response =
          await api.post(
            "/auth/logout",
          );

        return response.data;
      },

      onSuccess: async () => {
        if (
          typeof window !==
          "undefined"
        ) {
          localStorage.removeItem(
            "token",
          );

          localStorage.removeItem(
            "art_store_authenticated",
          );
        }

        queryClient.setQueryData(
          AUTH_QUERY_KEY,
          null,
        );

        setDesktopMenu(null);

        setMobileMenuOpen(
          false,
        );

        router.push("/");

        router.refresh();
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const {
    data: categoriesResponse,
    isLoading:
      categoriesLoading,
    isError: categoriesError,
  } = useActiveCategories();

  const allCategories =
    useMemo(() => {
      return extractCategories(
        categoriesResponse,
      );
    }, [categoriesResponse]);

  const paintingCategories =
    useMemo(() => {
      return allCategories.filter(
        isPaintingCategory,
      );
    }, [allCategories]);

  const courseCategories =
    useMemo(() => {
      return allCategories.filter(
        isCourseCategory,
      );
    }, [allCategories]);

  /*
  |--------------------------------------------------------------------------
  | Local Storage Cart
  |--------------------------------------------------------------------------
  */

  const loadLocalCart =
    useCallback(() => {
      const items =
        readCart().filter(
          isPaintingCartItem,
        );

      setCartItems(items);

      setCartReady(true);

      return items;
    }, []);

  const cartCount =
    useMemo(() => {
      return cartItems.reduce(
        (
          total,
          item,
        ) => {
          const quantity =
            Number(
              item?.quantity ||
                1,
            );

          return (
            total +
            (
              Number.isFinite(
                quantity,
              )
                ? quantity
                : 1
            )
          );
        },
        0,
      );
    }, [cartItems]);

  const subtotal =
    useMemo(() => {
      return cartItems.reduce(
        (
          total,
          item,
        ) => {
          const quantity =
            Number(
              item?.quantity ||
                1,
            );

          return (
            total +
            getCartItemPrice(
              item,
            ) *
              (
                Number.isFinite(
                  quantity,
                )
                  ? quantity
                  : 1
              )
          );
        },
        0,
      );
    }, [cartItems]);

  const currency =
    cartItems[0]?.currency ||
    "AED";

  const handleRemoveCartItem =
    useCallback(
      (cartItemId) => {
        try {
          setCartErrorMessage(
            "",
          );

          const updatedItems =
            removeLocalCartItem(
              cartItemId,
            );

          setCartItems(
            updatedItems,
          );
        } catch (error) {
          setCartErrorMessage(
            error?.message ||
              "Artwork could not be removed.",
          );
        }
      },
      [],
    );

  const handleCartQuantity =
    useCallback(
      (
        cartItemId,
        quantity,
      ) => {
        try {
          setCartErrorMessage(
            "",
          );

          const updatedItems =
            updateCartItemQuantity(
              cartItemId,
              quantity,
            );

          setCartItems(
            updatedItems,
          );
        } catch (error) {
          setCartErrorMessage(
            error?.message ||
              "Cart quantity could not be updated.",
          );
        }
      },
      [],
    );

  /*
  |--------------------------------------------------------------------------
  | Menu Functions
  |--------------------------------------------------------------------------
  */

  const openDesktopMenu = (
    menuName,
  ) => {
    if (
      closeMenuTimer.current
    ) {
      clearTimeout(
        closeMenuTimer.current,
      );
    }

    setDesktopMenu(menuName);
  };

  const closeDesktopMenuLater =
    () => {
      if (
        closeMenuTimer.current
      ) {
        clearTimeout(
          closeMenuTimer.current,
        );
      }

      closeMenuTimer.current =
        setTimeout(() => {
          setDesktopMenu(null);
        }, 170);
    };

  const closeMobileMenu =
    useCallback(() => {
      setMobileMenuOpen(false);

      setMobileShopOpen(false);

      setMobileCoursesOpen(
        false,
      );

      setMobileAccountOpen(
        false,
      );
    }, []);

  const openCart =
    useCallback(() => {
      loadLocalCart();

      setCartOpen(true);

      setSearchOpen(false);

      setDesktopMenu(null);

      setCartErrorMessage("");

      closeMobileMenu();
    }, [
      closeMobileMenu,
      loadLocalCart,
    ]);

  const handleSearch = (
    event,
  ) => {
    event.preventDefault();

    const cleanSearch =
      searchValue.trim();

    if (!cleanSearch) {
      return;
    }

    setSearchOpen(false);

    router.push(
      `/shop?search=${encodeURIComponent(
        cleanSearch,
      )}`,
    );
  };

  const isActiveRoute = (
    href,
  ) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(
      href,
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Cart Events
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadLocalCart();

    const handleCartUpdated =
      (event) => {
        loadLocalCart();

        if (
          event?.detail
            ?.openCart
        ) {
          setCartOpen(true);

          setSearchOpen(false);

          closeMobileMenu();
        }
      };

    const handleLegacyCartUpdated =
      () => {
        loadLocalCart();

        setCartOpen(true);
      };

    const handleOpenCart =
      () => {
        openCart();
      };

    const handleStorage = (
      event,
    ) => {
      if (
        !event.key ||
        event.key ===
          CART_STORAGE_KEY
      ) {
        loadLocalCart();
      }
    };

    window.addEventListener(
      CART_EVENT,
      handleCartUpdated,
    );

    window.addEventListener(
      "cartUpdated",
      handleLegacyCartUpdated,
    );

    window.addEventListener(
      "openCart",
      handleOpenCart,
    );

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        CART_EVENT,
        handleCartUpdated,
      );

      window.removeEventListener(
        "cartUpdated",
        handleLegacyCartUpdated,
      );

      window.removeEventListener(
        "openCart",
        handleOpenCart,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, [
    loadLocalCart,
    openCart,
    closeMobileMenu,
  ]);

  useEffect(() => {
    closeMobileMenu();

    setCartOpen(false);

    setSearchOpen(false);

    setDesktopMenu(null);
  }, [
    pathname,
    closeMobileMenu,
  ]);

  useEffect(() => {
    const overlayOpen =
      mobileMenuOpen ||
      cartOpen ||
      searchOpen;

    document.body.style.overflow =
      overlayOpen
        ? "hidden"
        : "";

    const handleEscape = (
      event,
    ) => {
      if (
        event.key !==
        "Escape"
      ) {
        return;
      }

      closeMobileMenu();

      setCartOpen(false);

      setSearchOpen(false);

      setDesktopMenu(null);
    };

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [
    cartOpen,
    closeMobileMenu,
    mobileMenuOpen,
    searchOpen,
  ]);

  useEffect(() => {
    return () => {
      if (
        closeMenuTimer.current
      ) {
        clearTimeout(
          closeMenuTimer.current,
        );
      }
    };
  }, []);

  return (
    <>
      <header
        onMouseLeave={
          closeDesktopMenuLater
        }
        className="sticky top-0 z-[80] border-b border-[#eadfd6] bg-[#fffdfb]"
      >
        <div className="mx-auto flex h-[78px] max-w-[1440px] items-center px-4 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                true,
              )
            }
            className="nav-icon mobile-menu-toggle"
            aria-label="Open navigation menu"
          >
            <Menu
              size={23}
              strokeWidth={1.8}
            />
          </button>

          <div className="ml-2 md:ml-0">
            <BrandLogo />
          </div>

          <nav className="ml-10 hidden h-full items-center gap-2 md:flex">
            <DesktopNavLink
              href="/"
              active={isActiveRoute(
                "/",
              )}
            >
              Home
            </DesktopNavLink>

            <div
              className="flex h-full items-center"
              onMouseEnter={() =>
                openDesktopMenu(
                  "shop",
                )
              }
            >
              <DesktopNavLink
                href="/shop"
                active={isActiveRoute(
                  "/shop",
                )}
              >
                Shop

                <ChevronDown
                  size={14}
                  strokeWidth={
                    1.8
                  }
                />
              </DesktopNavLink>
            </div>

            <DesktopNavLink
              href="/artist"
              active={isActiveRoute(
                "/artist",
              )}
            >
              About
            </DesktopNavLink>

            <div
              className="flex h-full items-center"
              onMouseEnter={() =>
                openDesktopMenu(
                  "courses",
                )
              }
            >
              <DesktopNavLink
                href="/courses"
                active={isActiveRoute(
                  "/courses",
                )}
              >
                Courses

                <ChevronDown
                  size={14}
                  strokeWidth={
                    1.8
                  }
                />
              </DesktopNavLink>
            </div>

            <DesktopNavLink
              href="/contact"
              active={isActiveRoute(
                "/contact",
              )}
            >
              Contact
            </DesktopNavLink>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setSearchOpen(
                  true,
                )
              }
              className="nav-icon"
              aria-label="Search artwork"
            >
              <Search
                size={21}
                strokeWidth={1.8}
              />
            </button>

            <div
              className="relative hidden md:block"
              onMouseEnter={() =>
                openDesktopMenu(
                  "account",
                )
              }
              onMouseLeave={
                closeDesktopMenuLater
              }
            >
              <button
                type="button"
                className="nav-icon"
                aria-label="Open account menu"
              >
                {authLoading ? (
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />
                ) : (
                  <UserRound
                    size={21}
                    strokeWidth={
                      1.8
                    }
                  />
                )}
              </button>

              <AccountDropdown
                open={
                  desktopMenu ===
                  "account"
                }
                user={user}
                userName={
                  userName
                }
                logoutPending={
                  logoutMutation.isPending
                }
                onLogout={() =>
                  logoutMutation.mutate()
                }
                onMouseEnter={() =>
                  openDesktopMenu(
                    "account",
                  )
                }
              />
            </div>

            <button
              type="button"
              onClick={openCart}
              className="nav-icon"
              aria-label="Open shopping cart"
            >
              <ShoppingBag
                size={21}
                strokeWidth={1.8}
              />

              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[#fffdfb] bg-[#b07f59] px-1 text-[8px] font-bold text-white">
                  {cartCount >
                  99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <MegaMenu
          open={
            desktopMenu ===
            "shop"
          }
          eyebrow="Shop Artwork"
          title="Original art for meaningful spaces."
          description="Explore original artwork created by a UAE-based artist for collectors worldwide."
          buttonLabel="Shop All Artwork"
          pathname="/shop"
          categories={
            paintingCategories
          }
          loading={
            categoriesLoading
          }
          error={
            categoriesError
          }
          emptyMessage="No artwork collections available."
          type="painting"
          onMouseEnter={() =>
            openDesktopMenu(
              "shop",
            )
          }
          onMouseLeave={
            closeDesktopMenuLater
          }
        />

        <MegaMenu
          open={
            desktopMenu ===
            "courses"
          }
          eyebrow="Online Courses"
          title="Learn art at your own pace."
          description="Explore creative online courses and learn directly from a UAE-based artist from anywhere in the world."
          buttonLabel="View All Courses"
          pathname="/courses"
          categories={
            courseCategories
          }
          loading={
            categoriesLoading
          }
          error={
            categoriesError
          }
          emptyMessage="No course categories available."
          type="course"
          onMouseEnter={() =>
            openDesktopMenu(
              "courses",
            )
          }
          onMouseLeave={
            closeDesktopMenuLater
          }
        />
      </header>

      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 z-[110] bg-[#362b24]/45 transition-opacity duration-300 ${
          mobileMenuOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      <aside
        aria-hidden={
          !mobileMenuOpen
        }
        className={`fixed left-0 top-0 z-[120] flex h-dvh w-[90%] max-w-[400px] flex-col bg-[#fffdfb] shadow-[20px_0_50px_rgba(78,56,41,0.2)] transition-transform duration-300 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-[76px] items-center justify-between border-b border-[#eadfd6] px-5">
          <BrandLogo compact />

          <button
            type="button"
            onClick={
              closeMobileMenu
            }
            className="nav-icon"
            aria-label="Close navigation menu"
          >
            <X
              size={21}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {user ? (
          <Link
            href="/my-orders"
            className="mx-5 mt-5 flex items-center gap-3 rounded-lg border border-[#eadfd6] bg-[#faf5f1] p-4 transition hover:border-[#caa283] hover:bg-[#f8efe8]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8f6b52] text-white">
              <UserRound
                size={21}
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#4c4038]">
                {userName}
              </p>

              <p className="mt-1 truncate text-xs text-[#83766c]">
                {user.email}
              </p>
            </div>

            <ArrowRight
              size={16}
              className="shrink-0 text-[#b07f59]"
            />
          </Link>
        ) : (
          <div className="mx-5 mt-5 rounded-lg border border-[#eadfd6] bg-[#faf5f1] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0e4da] text-[#8f6b52]">
                <UserRound
                  size={21}
                  strokeWidth={
                    1.8
                  }
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#4c4038]">
                  Welcome
                </p>

                <p className="mt-1 text-xs text-[#83766c]">
                  Login to manage
                  your account
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="mt-4 flex min-h-[42px] items-center justify-center rounded-md bg-[#6f5543] text-sm font-semibold text-white transition hover:bg-[#b07f59]"
            >
              Login
            </Link>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 pb-7 pt-3">
          <MobileNavLink href="/">
            Home
          </MobileNavLink>

          <MobileAccordion
            title="Shop"
            open={
              mobileShopOpen
            }
            onClick={() =>
              setMobileShopOpen(
                (current) =>
                  !current,
              )
            }
          >
            <MobileSubLink href="/shop">
              Shop All
            </MobileSubLink>

            {paintingCategories.map(
              (category) => (
                <MobileSubLink
                  key={getCategoryId(
                    category,
                  )}
                  href={{
                    pathname:
                      "/shop",

                    query: {
                      category:
                        getCategoryId(
                          category,
                        ),
                    },
                  }}
                >
                  {getCategoryTitle(
                    category,
                  )}
                </MobileSubLink>
              ),
            )}
          </MobileAccordion>

          <MobileNavLink href="/artist">
            About
          </MobileNavLink>

          <MobileAccordion
            title="Courses"
            open={
              mobileCoursesOpen
            }
            onClick={() =>
              setMobileCoursesOpen(
                (current) =>
                  !current,
              )
            }
          >
            <MobileSubLink href="/courses">
              View All Courses
            </MobileSubLink>

            {courseCategories.map(
              (category) => (
                <MobileSubLink
                  key={getCategoryId(
                    category,
                  )}
                  href={{
                    pathname:
                      "/courses",

                    query: {
                      category:
                        getCategoryId(
                          category,
                        ),
                    },
                  }}
                >
                  {getCategoryTitle(
                    category,
                  )}
                </MobileSubLink>
              ),
            )}
          </MobileAccordion>

          <MobileNavLink href="/contact">
            Contact
          </MobileNavLink>

          <MobileAccordion
            title={
              user
                ? "Account Menu"
                : "Account"
            }
            open={
              mobileAccountOpen
            }
            onClick={() =>
              setMobileAccountOpen(
                (current) =>
                  !current,
              )
            }
          >
            {user ? (
              <>
                <MobileSubLink href="/my-orders">
                  My Account
                </MobileSubLink>

                <MobileSubLink href="/my-orders">
                  My Orders
                </MobileSubLink>

                <MobileSubLink href="/courses/learning">
                  My Courses
                </MobileSubLink>

                <button
                  type="button"
                  onClick={() =>
                    logoutMutation.mutate()
                  }
                  disabled={
                    logoutMutation.isPending
                  }
                  className="flex w-full items-center gap-2 py-3 text-sm font-medium text-[#b85f54] transition hover:text-[#94453d] disabled:opacity-50"
                >
                  {logoutMutation.isPending ? (
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <LogOut
                      size={16}
                    />
                  )}

                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileSubLink href="/login">
                  Login
                </MobileSubLink>

                <MobileSubLink href="/register">
                  Create Account
                </MobileSubLink>
              </>
            )}
          </MobileAccordion>
        </div>

        <div className="border-t border-[#eadfd6] bg-[#faf5f1] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6f5543]">
            UAE-based artist
          </p>

          <p className="mt-1 text-xs leading-5 text-[#83766c]">
            Original artwork and
            online learning
            available worldwide.
          </p>
        </div>
      </aside>

      <div
        onClick={() =>
          setSearchOpen(false)
        }
        className={`fixed inset-0 z-[140] bg-[#362b24]/45 transition-opacity ${
          searchOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      >
        <div
          onClick={(event) =>
            event.stopPropagation()
          }
          className={`w-full bg-[#fffdfb] shadow-[0_20px_50px_rgba(78,56,41,0.2)] transition-transform duration-300 ${
            searchOpen
              ? "translate-y-0"
              : "-translate-y-full"
          }`}
        >
          <div className="mx-auto max-w-[900px] px-5 py-8 sm:py-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium text-[#4c4038]">
                Search artwork
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSearchOpen(
                    false,
                  )
                }
                className="nav-icon"
                aria-label="Close search"
              >
                <X
                  size={21}
                  strokeWidth={
                    1.8
                  }
                />
              </button>
            </div>

            <form
              onSubmit={
                handleSearch
              }
              className="mt-6 flex items-center border-b-2 border-[#b07f59]"
            >
              <Search
                size={21}
                strokeWidth={1.8}
                className="shrink-0 text-[#9a7a63]"
              />

              <input
                type="search"
                value={
                  searchValue
                }
                onChange={(
                  event,
                ) =>
                  setSearchValue(
                    event.target
                      .value,
                  )
                }
                placeholder="Search paintings, styles or collections"
                autoFocus={
                  searchOpen
                }
                className="min-w-0 flex-1 bg-transparent px-4 py-4 text-base text-[#4c4038] outline-none placeholder:text-[#a89a8f]"
              />

              <button
                type="submit"
                disabled={
                  !searchValue.trim()
                }
                className="rounded-md bg-[#6f5543] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b07f59] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div
        onClick={() =>
          setCartOpen(false)
        }
        className={`fixed inset-0 z-[150] bg-[#362b24]/45 transition-opacity ${
          cartOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      <aside
        aria-hidden={!cartOpen}
        className={`fixed right-0 top-0 z-[160] flex h-dvh w-full max-w-[480px] flex-col bg-[#fffdfb] shadow-[-20px_0_55px_rgba(78,56,41,0.22)] transition-transform duration-300 ${
          cartOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex min-h-[80px] items-center justify-between border-b border-[#eadfd6] px-6">
          <div>
            <h2 className="text-xl font-semibold text-[#4c4038]">
              Your cart
            </h2>

            <p className="mt-1 text-xs text-[#83766c]">
              {cartCount}{" "}
              {cartCount === 1
                ? "item"
                : "items"}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setCartOpen(false)
            }
            className="nav-icon"
            aria-label="Close shopping cart"
          >
            <X
              size={21}
              strokeWidth={1.8}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {cartErrorMessage && (
            <div className="mt-5 rounded-lg border border-[#e6beb8] bg-[#fff4f2] px-4 py-3 text-xs text-[#a85248]">
              {cartErrorMessage}
            </div>
          )}

          {!cartReady ? (
            <CartLoading />
          ) : cartItems.length ===
            0 ? (
            <EmptyCart
              onClose={() =>
                setCartOpen(
                  false,
                )
              }
            />
          ) : (
            <div>
              {cartItems.map(
                (item) => {
                  const cartItemId =
                    getCartItemId(
                      item,
                    );

                  const title =
                    getCartItemTitle(
                      item,
                    );

                  const image =
                    getCartItemImage(
                      item,
                    );

                  const price =
                    getCartItemPrice(
                      item,
                    );

                  const quantity =
                    Number(
                      item?.quantity ||
                        1,
                    );

                  const hasKnownStock =
                    item?.stock !== null &&
                    item?.stock !== undefined;

                  const stock = hasKnownStock
                    ? Math.max(0, Number(item.stock || 0))
                    : null;

                  const reachedStock =
                    hasKnownStock &&
                    (stock <= 0 || quantity >= stock);

                  return (
                    <article
                      key={
                        cartItemId
                      }
                      className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 border-b border-[#eadfd6] py-5"
                    >
                      <div className="h-[110px] overflow-hidden rounded-md bg-[#f6f0eb]">
                        {image ? (
                          <img
                            src={
                              image
                            }
                            alt={
                              title
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#a58267]">
                            <ShoppingBag
                              size={
                                25
                              }
                              strokeWidth={
                                1.6
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-col justify-between">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#b07f59]">
                              Original
                              artwork
                            </p>

                            <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-5 text-[#4c4038]">
                              {title}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveCartItem(
                                cartItemId,
                              )
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#8d7d72] transition hover:bg-[#fff0ed] hover:text-[#b85f54]"
                            aria-label={`Remove ${title}`}
                          >
                            <Trash2
                              size={
                                15
                              }
                              strokeWidth={
                                1.8
                              }
                            />
                          </button>
                        </div>

                        <div className="flex items-end justify-between gap-3">
                          <div className="flex h-8 items-center overflow-hidden rounded-md border border-[#dfcec0] bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                handleCartQuantity(
                                  cartItemId,
                                  quantity -
                                    1,
                                )
                              }
                              className="flex h-full w-8 items-center justify-center text-[#6f5543] transition hover:bg-[#f8efe8]"
                              aria-label={`Decrease ${title} quantity`}
                            >
                              <Minus
                                size={
                                  13
                                }
                              />
                            </button>

                            <span className="flex h-full min-w-8 items-center justify-center border-x border-[#eadfd6] px-2 text-xs font-semibold text-[#4c4038]">
                              {
                                quantity
                              }
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleCartQuantity(
                                  cartItemId,
                                  quantity +
                                    1,
                                )
                              }
                              disabled={
                                reachedStock
                              }
                              className="flex h-full w-8 items-center justify-center text-[#6f5543] transition hover:bg-[#f8efe8] disabled:cursor-not-allowed disabled:opacity-35"
                              aria-label={`Increase ${title} quantity`}
                            >
                              <Plus
                                size={
                                  13
                                }
                              />
                            </button>
                          </div>

                          <strong className="text-sm font-semibold text-[#6f5543]">
                            {formatMoney(
                              price *
                                quantity,
                              currency,
                            )}
                          </strong>
                        </div>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          )}
        </div>

        <div className="border-t border-[#eadfd6] bg-[#faf5f1] px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#4c4038]">
              Subtotal
            </span>

            <strong className="text-lg font-semibold text-[#6f5543]">
              {formatMoney(
                subtotal,
                currency,
              )}
            </strong>
          </div>

          <p className="mt-2 text-xs text-[#83766c]">
            Shipping and taxes are
            calculated during
            checkout.
          </p>

          {cartItems.length >
          0 ? (
            <Link
              href="/cart"
              onClick={() =>
                setCartOpen(
                  false,
                )
              }
              className="mt-5 flex min-h-[52px] w-full items-center justify-center rounded-md bg-[#6f5543] px-6 text-sm font-semibold text-white transition hover:bg-[#b07f59]"
            >
              View cart
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="mt-5 min-h-[52px] w-full rounded-md bg-[#d8c9bd] text-sm font-semibold text-white"
            >
              Cart is empty
            </button>
          )}

          <Link
            href="/shop"
            onClick={() =>
              setCartOpen(false)
            }
            className="mt-3 flex min-h-[45px] items-center justify-center text-sm font-medium text-[#6f5543] underline decoration-[#c89b77] underline-offset-4 transition hover:text-[#b07f59]"
          >
            Continue shopping
          </Link>
        </div>
      </aside>

      <style jsx global>{`
        .nav-icon {
          position: relative;
          display: inline-flex;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          border-radius: 8px;
          background: transparent;
          color: #5d5047;
          cursor: pointer;
          transition:
            background-color 180ms ease,
            border-color 180ms ease,
            color 180ms ease,
            transform 180ms ease;
        }

        .nav-icon:hover {
          border-color: #e5d4c6;
          background: #f9f0e9;
          color: #b07f59;
          transform: translateY(
            -1px
          );
        }

        .nav-icon:focus-visible {
          outline: 2px solid
            #b07f59;
          outline-offset: 2px;
        }

        .mobile-menu-toggle {
          display: inline-flex;
        }

        @media (min-width: 768px) {
          .mobile-menu-toggle {
            display: none !important;
          }
        }

        .mega-menu-button {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 0 20px;
          border: 1px solid
            #6f5543;
          border-radius: 8px;
          background: #6f5543;
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-decoration: none;
          transition:
            background-color 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            transform 180ms ease;
        }

        .mega-menu-button:hover {
          border-color: #b07f59;
          background: #b07f59;
          box-shadow: 0 8px
            20px
            rgba(
              176,
              127,
              89,
              0.22
            );
          transform: translateY(
            -1px
          );
        }
      `}</style>
    </>
  );
}

/*
|--------------------------------------------------------------------------
| Brand Logo
|--------------------------------------------------------------------------
*/

function BrandLogo({
  compact = false,
}) {
  const [
    logoError,
    setLogoError,
  ] = useState(false);

  return (
    <Link
      href="/"
      className="flex shrink-0 items-center"
      aria-label="Rakhshinda Art home"
    >
      {!logoError ? (
        <img
          src="/images/logo.png"
          alt="Rakhshinda Art"
          onError={() =>
            setLogoError(true)
          }
          className={`object-contain ${
            compact
              ? "max-h-[42px] max-w-[155px]"
              : "max-h-[52px] max-w-[190px]"
          }`}
        />
      ) : (
        <div>
          <span
            className={`block font-serif font-medium uppercase leading-none tracking-[0.13em] text-[#4c4038] ${
              compact
                ? "text-base"
                : "text-lg"
            }`}
          >
            Rakhshinda
          </span>

          <span className="mt-1 block text-[7px] font-semibold uppercase tracking-[0.55em] text-[#b07f59]">
            Art
          </span>
        </div>
      )}
    </Link>
  );
}

/*
|--------------------------------------------------------------------------
| Desktop Navigation
|--------------------------------------------------------------------------
*/

function DesktopNavLink({
  href,
  active,
  children,
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex h-full items-center gap-1.5 px-3.5 text-[13.5px] font-medium tracking-[0.01em] transition-colors duration-200 ${
        active
          ? "text-[#9a7454]"
          : "text-[#51473f] hover:text-[#b07f59]"
      }`}
    >
      {children}

      <span
        className={`absolute bottom-0 left-3.5 right-3.5 h-[2px] origin-center bg-[#b07f59] transition-transform duration-200 ${
          active
            ? "scale-x-100"
            : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}

/*
|--------------------------------------------------------------------------
| Desktop Mega Menu
|--------------------------------------------------------------------------
*/

function MegaMenu({
  open,
  eyebrow,
  title,
  description,
  buttonLabel,
  pathname,
  categories,
  loading,
  error,
  emptyMessage,
  type,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <div
      onMouseEnter={
        onMouseEnter
      }
      onMouseLeave={
        onMouseLeave
      }
      className={`absolute left-0 right-0 top-full hidden border-t border-[#eadfd6] bg-[#fffdfb] shadow-[0_18px_45px_rgba(91,67,49,0.12)] transition-all duration-200 md:block ${
        open
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-1 opacity-0"
      }`}
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-[240px_minmax(0,1fr)] gap-8 px-8 py-8">
        <div className="flex flex-col border-r border-[#eadfd6] pr-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b07f59]">
            {eyebrow}
          </p>

          <h2 className="heading-text mt-3 text-[30px] font-medium leading-[1.02] tracking-[-0.025em] text-[#241711]">
            {title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#786c63]">
            {description}
          </p>

          <Link
            href={pathname}
            className="mega-menu-button mt-6 self-start"
          >
            {buttonLabel}

            <ArrowRight
              size={14}
              strokeWidth={1.8}
            />
          </Link>
        </div>

        {loading ? (
          <MenuState>
            Loading categories...
          </MenuState>
        ) : error ? (
          <MenuState>
            Categories could not
            be loaded.
          </MenuState>
        ) : categories.length ===
          0 ? (
          <MenuState>
            {emptyMessage}
          </MenuState>
        ) : (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {categories
              .slice(0, 4)
              .map(
                (category) => (
                  <CategoryCard
                    key={getCategoryId(
                      category,
                    )}
                    href={{
                      pathname,

                      query: {
                        category:
                          getCategoryId(
                            category,
                          ),
                      },
                    }}
                    title={getCategoryTitle(
                      category,
                    )}
                    image={getCategoryImage(
                      category,
                    )}
                    type={type}
                  />
                ),
              )}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuState({
  children,
}) {
  return (
    <div className="flex min-h-[190px] items-center justify-center rounded-lg border border-dashed border-[#dfcec0] bg-[#fdf9f6] px-5 text-center text-sm text-[#83766c]">
      {children}
    </div>
  );
}

function CategoryCard({
  href,
  title,
  image,
  type,
}) {
  const isCourse =
    type === "course";

  return (
    <Link
      href={href}
      className="group block"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#f5eee8]">
        {image ? (
          <img
            src={image}
            alt={
              isCourse
                ? `${title} online art course category`
                : `${title} original artwork collection`
            }
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#a58267]">
            {isCourse ? (
              <GraduationCap
                size={32}
                strokeWidth={
                  1.5
                }
              />
            ) : (
              <ShoppingBag
                size={28}
                strokeWidth={
                  1.6
                }
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#b07f59]">
            {isCourse
              ? "Course Category"
              : "Art Collection"}
          </p>

          <h3 className="mt-1 text-sm font-medium text-[#51473f] transition group-hover:text-[#b07f59]">
            {title}
          </h3>
        </div>

        <ArrowRight
          size={14}
          className="shrink-0 text-[#a58267] transition group-hover:translate-x-1 group-hover:text-[#b07f59]"
        />
      </div>
    </Link>
  );
}

/*
|--------------------------------------------------------------------------
| Account Dropdown
|--------------------------------------------------------------------------
*/

function AccountDropdown({
  open,
  user,
  userName,
  logoutPending,
  onLogout,
  onMouseEnter,
}) {
  return (
    <div
      onMouseEnter={
        onMouseEnter
      }
      className={`absolute right-0 top-full w-[280px] rounded-lg border border-[#eadfd6] bg-[#fffdfb] p-3 shadow-[0_14px_35px_rgba(91,67,49,0.14)] transition-all ${
        open
          ? "visible translate-y-2 opacity-100"
          : "invisible translate-y-0 opacity-0"
      }`}
    >
      {user ? (
        <>
          <div className="flex items-center gap-3 border-b border-[#eadfd6] px-2 pb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8f6b52] text-white">
              <UserRound
                size={19}
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#4c4038]">
                {userName}
              </p>

              <p className="mt-1 truncate text-xs text-[#83766c]">
                {user.email}
              </p>
            </div>
          </div>

          <AccountLink
            href="/my-orders"
            icon={
              <LayoutDashboard
                size={16}
              />
            }
          >
            My Account
          </AccountLink>

          <AccountLink
            href="/my-orders"
            icon={
              <PackageCheck
                size={16}
              />
            }
          >
            My Orders
          </AccountLink>

          <AccountLink
            href="/courses/learning"
            icon={
              <GraduationCap
                size={16}
              />
            }
          >
            My Courses
          </AccountLink>

          <button
            type="button"
            onClick={onLogout}
            disabled={
              logoutPending
            }
            className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm text-[#b85f54] transition hover:bg-[#fff0ed] hover:text-[#94453d] disabled:opacity-50"
          >
            {logoutPending ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            ) : (
              <LogOut size={16} />
            )}

            Logout
          </button>
        </>
      ) : (
        <>
          <div className="px-2 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e4da] text-[#8f6b52]">
              <UserRound
                size={19}
                strokeWidth={1.8}
              />
            </div>

            <h3 className="mt-3 text-lg font-semibold text-[#4c4038]">
              Welcome
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#83766c]">
              Login to view your
              orders and purchased
              courses.
            </p>
          </div>

          <Link
            href="/login"
            className="flex min-h-[44px] items-center justify-center rounded-md bg-[#6f5543] text-sm font-semibold text-white transition hover:bg-[#b07f59]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="mt-2 flex min-h-[44px] items-center justify-center rounded-md border border-[#dfcec0] text-sm font-semibold text-[#6f5543] transition hover:border-[#c79b72] hover:bg-[#f8efe8] hover:text-[#b07f59]"
          >
            Create account
          </Link>
        </>
      )}
    </div>
  );
}

function AccountLink({
  href,
  icon,
  children,
}) {
  return (
    <Link
      href={href}
      className="mt-1 flex items-center gap-3 rounded-md px-3 py-3 text-sm text-[#51473f] transition hover:bg-[#f8efe8] hover:text-[#b07f59]"
    >
      <span className="text-[#9b765a]">
        {icon}
      </span>

      {children}
    </Link>
  );
}

/*
|--------------------------------------------------------------------------
| Mobile Navigation
|--------------------------------------------------------------------------
*/

function MobileNavLink({
  href,
  children,
}) {
  return (
    <Link
      href={href}
      className="flex min-h-[56px] items-center justify-between border-b border-[#eadfd6] text-base font-medium text-[#4c4038] transition hover:text-[#b07f59]"
    >
      {children}

      <ArrowRight
        size={16}
        className="text-[#a58267]"
      />
    </Link>
  );
}

function MobileAccordion({
  title,
  open,
  onClick,
  children,
}) {
  return (
    <div className="border-b border-[#eadfd6]">
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-[56px] w-full items-center justify-between text-base font-medium text-[#4c4038] transition hover:text-[#b07f59]"
        aria-expanded={open}
      >
        {title}

        <ChevronDown
          size={17}
          className={`text-[#a58267] transition-transform ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden pl-4 transition-all duration-300 ${
          open
            ? "max-h-[500px] pb-3 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function MobileSubLink({
  href,
  children,
}) {
  return (
    <Link
      href={href}
      className="block border-b border-[#f0e7df] py-3 text-sm text-[#6f6258] transition hover:text-[#b07f59]"
    >
      {children}
    </Link>
  );
}

/*
|--------------------------------------------------------------------------
| Cart States
|--------------------------------------------------------------------------
*/

function CartLoading() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <LoaderCircle
        size={30}
        className="animate-spin text-[#b07f59]"
      />

      <p className="mt-4 text-sm text-[#83766c]">
        Loading your cart...
      </p>
    </div>
  );
}

function EmptyCart({
  onClose,
}) {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center px-5 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f3e8df] text-[#a58267]">
        <ShoppingBag
          size={30}
          strokeWidth={1.7}
        />
      </div>

      <h3 className="mt-6 text-xl font-semibold text-[#4c4038]">
        Your cart is empty
      </h3>

      <p className="mt-3 max-w-[300px] text-sm leading-6 text-[#83766c]">
        Explore original artwork
        and add your favourite
        piece to the cart.
      </p>

      <Link
        href="/shop"
        onClick={onClose}
        className="mt-6 flex min-h-[48px] items-center justify-center rounded-md bg-[#6f5543] px-7 text-sm font-semibold text-white transition hover:bg-[#b07f59]"
      >
        Shop artwork
      </Link>
    </div>
  );
}