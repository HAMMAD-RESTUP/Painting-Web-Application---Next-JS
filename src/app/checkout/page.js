"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import flags from "react-phone-number-input/flags";

import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js/max";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  ImageIcon,
  Landmark,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPin,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";

import { useMutation } from "@tanstack/react-query";

import { api } from "../lib/api";
import {
  CART_EVENT,
  CART_STORAGE_KEY,
  clearCart,
  readCart,
  toOrderItems,
} from "../lib/localCart";

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

const ORDER_CREATE_ENDPOINT =
  "/order/create";

const BANK_TRANSFER_PROOF_ENDPOINT =
  "/payment/bank-transfer/proof";

const ZIINA_PAYMENT_ENDPOINT =
  "/payment/painting/ziina/create";

const BANK_DETAILS = {
  bankName:
    process.env.NEXT_PUBLIC_BANK_NAME ||
    "Your Bank Name",

  accountName:
    process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ||
    "Rakhshinda Art",

  accountNumber:
    process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ||
    "Add account number",

  iban:
    process.env.NEXT_PUBLIC_BANK_IBAN ||
    "Add IBAN in .env.local",
};

/*
|--------------------------------------------------------------------------
| Initial Data
|--------------------------------------------------------------------------
*/

const INITIAL_FORM = {
  fullName: "",
  email: "",

  phoneCountry: "AE",
  phone: "",

  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",

  transactionReference: "",
};

/*
|--------------------------------------------------------------------------
| Countries
|--------------------------------------------------------------------------
*/

const countryDisplayNames =
  typeof Intl !== "undefined" &&
  Intl.DisplayNames
    ? new Intl.DisplayNames(
        ["en"],
        {
          type: "region",
        }
      )
    : null;

const COUNTRY_OPTIONS =
  getCountries()
    .map((countryCode) => ({
      code: countryCode,

      name:
        countryDisplayNames?.of(
          countryCode
        ) || countryCode,

      dialCode: `+${getCountryCallingCode(
        countryCode
      )}`,
    }))
    .sort((first, second) =>
      first.name.localeCompare(
        second.name
      )
    );

/*
|--------------------------------------------------------------------------
| General Helpers
|--------------------------------------------------------------------------
*/

const getErrorMessage = (
  error,
  fallback = "Something went wrong."
) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data
      ?.errors?.[0] ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const toSafeNumber = (
  value,
  fallback = 0
) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

const formatMoney = (
  amount,
  currency = "AED"
) => {
  return new Intl.NumberFormat(
    "en-AE",
    {
      style: "currency",

      currency: String(
        currency || "AED"
      ).toUpperCase(),

      currencyDisplay: "code",

      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(
    toSafeNumber(amount, 0)
  );
};

/*
|--------------------------------------------------------------------------
| Cart Helpers
|--------------------------------------------------------------------------
*/

const getPainting = (item) => {
  return (
    item?.painting ||
    item?.product ||
    item?.item ||
    null
  );
};

const getItemPrice = (item) => {
  const painting =
    getPainting(item);

  return toSafeNumber(
    item?.unitPrice ??
      item?.price ??
      painting?.price,
    0
  );
};

const getCartItemId = (
  item
) => {
  return (
    item?._id ||
    item?.id ||
    ""
  );
};

const isPaintingItem = (
  item
) => {
  return (
    item?.itemType ===
      "painting" ||
    Boolean(item?.painting)
  );
};

const getItemTitle = (
  item
) => {
  const painting =
    getPainting(item);

  return (
    item?.title ||
    painting?.title ||
    "Original Artwork"
  );
};

const getItemImage = (
  item
) => {
  const painting =
    getPainting(item);

  return (
    item?.image?.url ||
    item?.thumbnail?.url ||
    (typeof item?.image === "string" ? item.image : "") ||
    (typeof item?.thumbnail === "string" ? item.thumbnail : "") ||
    painting?.image?.url ||
    painting?.thumbnail?.url ||
    painting?.coverImage?.url ||
    ""
  );
};

const getItemStock = (
  item
) => {
  const painting =
    getPainting(item);

  const stockValue =
    item?.stock ??
    item?.availableStock ??
    painting?.stock;

  if (
    stockValue === null ||
    stockValue === undefined
  ) {
    return null;
  }

  return Math.max(
    toSafeNumber(
      stockValue,
      0
    ),
    0
  );
};

/*
|--------------------------------------------------------------------------
| Phone Helpers
|--------------------------------------------------------------------------
*/

const getCountryOption = (
  countryCode
) => {
  return (
    COUNTRY_OPTIONS.find(
      (country) =>
        country.code ===
        countryCode
    ) || COUNTRY_OPTIONS[0]
  );
};

const formatPhoneInput = (
  value,
  countryCode
) => {
  const digits = String(
    value || ""
  )
    .replace(/\D/g, "")
    .slice(0, 15);

  return new AsYouType(
    countryCode
  ).input(digits);
};

const validatePhoneNumber = (
  phoneValue,
  countryCode
) => {
  const country =
    getCountryOption(
      countryCode
    );

  let digits = String(
    phoneValue || ""
  ).replace(/\D/g, "");

  /*
  |--------------------------------------------------------------------------
  | Local numbers often begin with zero.
  | Country calling code ke saath leading zero remove hoga.
  |--------------------------------------------------------------------------
  */

  digits = digits.replace(
    /^0+/,
    ""
  );

  if (!digits) {
    return {
      valid: false,
      e164: "",
      error:
        "Phone number is required.",
    };
  }

  const internationalNumber =
    `${country.dialCode}${digits}`;

  const parsed =
    parsePhoneNumberFromString(
      internationalNumber
    );

  if (!parsed) {
    return {
      valid: false,
      e164: "",
      error:
        "Enter a valid phone number.",
    };
  }

  if (!parsed.isValid()) {
    return {
      valid: false,
      e164: "",

      error:
        `Enter a valid ${country.name} phone number.`,
    };
  }

  if (
    parsed.country !==
    countryCode
  ) {
    return {
      valid: false,
      e164: "",

      error:
        "This number does not belong to the selected country.",
    };
  }

  return {
    valid: true,
    e164: parsed.number,
    error: "",
  };
};

/*
|--------------------------------------------------------------------------
| Order Helpers
|--------------------------------------------------------------------------
*/

const getOrderFromResponse = (
  payload
) => {
  return (
    payload?.data?.order ||
    payload?.order ||
    payload?.data?.data
      ?.order ||
    null
  );
};

const getOrderId = (
  payload,
  order
) => {
  return (
    order?._id ||
    order?.id ||
    payload?.data?.orderId ||
    payload?.orderId ||
    payload?.data?.data
      ?.orderId ||
    ""
  );
};

/*
|--------------------------------------------------------------------------
| Checkout Page
|--------------------------------------------------------------------------
*/

export default function CheckoutPage() {
  const [
    formData,
    setFormData,
  ] = useState(
    INITIAL_FORM
  );

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("card");

  const [
    paymentProof,
    setPaymentProof,
  ] = useState(null);

  const [errors, setErrors] =
    useState({});

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  const [
    successOrder,
    setSuccessOrder,
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Stored User
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    try {
      const storedUser =
        JSON.parse(
          localStorage.getItem(
            "user"
          ) || "null"
        );

      if (
        storedUser &&
        typeof storedUser ===
          "object"
      ) {
        setFormData(
          (current) => ({
            ...current,

            fullName:
              storedUser.fullName ||
              storedUser.name ||
              "",

            email:
              storedUser.email ||
              "",
          })
        );
      }
    } catch {
      // Guest checkout allowed.
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Local Storage Cart
  |--------------------------------------------------------------------------
  */

  const [cartItems, setCartItems] =
    useState([]);

  const [cartReady, setCartReady] =
    useState(false);

  useEffect(() => {
    const loadCart = () => {
      setCartItems(readCart());
      setCartReady(true);
    };

    const handleStorage = (event) => {
      if (!event.key || event.key === CART_STORAGE_KEY) {
        loadCart();
      }
    };

    loadCart();
    window.addEventListener(CART_EVENT, loadCart);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(CART_EVENT, loadCart);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const paintingItems = useMemo(
    () => cartItems.filter(isPaintingItem),
    [cartItems]
  );

  const hasInvalidItems =
    paintingItems.length !== cartItems.length;

  const currency =
    paintingItems[0]?.currency || "AED";

  const cartCount = useMemo(
    () =>
      paintingItems.reduce(
        (total, item) =>
          total + Math.max(toSafeNumber(item?.quantity, 1), 1),
        0
      ),
    [paintingItems]
  );

  const subtotal = useMemo(
    () =>
      paintingItems.reduce((total, item) => {
        const quantity = Math.max(
          toSafeNumber(item?.quantity, 1),
          1
        );

        return total + getItemPrice(item) * quantity;
      }, 0),
    [paintingItems]
  );

  const selectedCountry =
    useMemo(
      () =>
        getCountryOption(
          formData.phoneCountry
        ),
      [formData.phoneCountry]
    );

  const hasUnavailableItems =
    useMemo(() => {
      return paintingItems.some(
        (item) => {
          const quantity =
            Math.max(
              toSafeNumber(
                item?.quantity,
                1
              ),
              1
            );

          const stock =
            getItemStock(item);

          return (
            stock !== null &&
            (
              stock <= 0 ||
              quantity > stock
            )
          );
        }
      );
    }, [paintingItems]);

  /*
  |--------------------------------------------------------------------------
  | Checkout Mutation
  |--------------------------------------------------------------------------
  */

  const checkoutMutation =
    useMutation({
      mutationFn: async () => {
        const phoneValidation =
          validatePhoneNumber(
            formData.phone,
            formData.phoneCountry
          );

        const customer = {
          fullName:
            formData.fullName.trim(),

          email:
            formData.email
              .trim()
              .toLowerCase(),

          phone:
            phoneValidation.e164,

          countryCode:
            formData.phoneCountry,

          dialCode:
            selectedCountry.dialCode,
        };

        const shippingAddress = {
          fullName:
            formData.fullName.trim(),

          phone:
            phoneValidation.e164,

          country:
            selectedCountry.name,

          countryCode:
            formData.phoneCountry,

          addressLine1:
            formData.addressLine1.trim(),

          addressLine2:
            formData.addressLine2.trim(),

          city:
            formData.city.trim(),

          state:
            formData.state.trim(),

          postalCode:
            formData.postalCode.trim(),
        };

        /*
        |--------------------------------------------------------------------------
        | Raw card number / expiry / CVC backend ko send nahi ho rahe.
        | Current backend Ziina secure checkout use karta hai.
        |--------------------------------------------------------------------------
        */

        const backendPaymentMethod =
          paymentMethod === "card"
            ? "ziina"
            : "bank_transfer";

        const orderHttpResponse =
          await api.post(
            ORDER_CREATE_ENDPOINT,

            {
              customer,
              shippingAddress,
              items: toOrderItems(paintingItems),
              subtotal,
              totalAmount: subtotal,
              currency,

              paymentMethod:
                backendPaymentMethod,

              customerNote:
                "Painting order placed through website checkout.",
            }
          );

        const orderResponse =
          orderHttpResponse.data;

        const order =
          getOrderFromResponse(
            orderResponse
          );

        const orderId =
          getOrderId(
            orderResponse,
            order
          );

        if (!orderId) {
          throw new Error(
            "Backend did not return an order ID."
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Bank Transfer
        |--------------------------------------------------------------------------
        */

        if (
          paymentMethod ===
          "bank_transfer"
        ) {
          const proofData =
            new FormData();

          proofData.append(
            "image",
            paymentProof
          );

          proofData.append(
            "transactionReference",
            formData
              .transactionReference
              .trim()
          );

          proofData.append(
            "senderName",
            formData.fullName.trim()
          );

          proofData.append(
            "bankName",
            BANK_DETAILS.bankName
          );

          proofData.append(
            "transferredAt",
            new Date().toISOString()
          );

          const proofResponse =
            await api.post(
              `${BANK_TRANSFER_PROOF_ENDPOINT}/${orderId}`,

              proofData
            );

          return {
            type:
              "bank_transfer",

            order,
            orderId,

            message:
              proofResponse.data
                ?.message ||
              "Painting order submitted successfully.",
          };
        }

        /*
        |--------------------------------------------------------------------------
        | Ziina Secure Card Checkout
        |--------------------------------------------------------------------------
        */

        const paymentResponse =
          await api.post(
            `${ZIINA_PAYMENT_ENDPOINT}/${orderId}`,

            {
              orderId,
              amount: subtotal,
              currency,
            }
          );

        const paymentData =
          paymentResponse.data
            ?.data ||
          paymentResponse.data ||
          {};

        const checkoutUrl =
          paymentData.checkoutUrl ||
          paymentData.redirectUrl ||
          paymentData.redirect_url ||
          "";

        if (!checkoutUrl) {
          throw new Error(
            "Secure card checkout URL was not returned."
          );
        }

        return {
          type: "card",
          order,
          orderId,
          checkoutUrl,
        };
      },

      onMutate: () => {
        setSubmitError("");
      },

      onSuccess: async (
        result
      ) => {
        if (
          result.type ===
          "card"
        ) {
          sessionStorage.setItem(
            "painting_payment_order_id",
            result.orderId
          );

          sessionStorage.setItem(
            "painting_checkout_cart",
            JSON.stringify(paintingItems)
          );

          window.location.assign(
            result.checkoutUrl
          );

          return;
        }

        clearCart();
        setCartItems([]);

        setSuccessOrder({
          ...result.order,

          message:
            result.message,

          paymentType:
            "bank_transfer",

          orderNumber:
            result.order
              ?.orderNumber ||
            result.order
              ?.reference ||
            result.orderId,
        });
      },

      onError: (error) => {
        setSubmitError(
          getErrorMessage(
            error,
            "Checkout could not be completed."
          )
        );
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Handlers
  |--------------------------------------------------------------------------
  */

  const clearError = (
    name
  ) => {
    setErrors(
      (current) => ({
        ...current,
        [name]: "",
      })
    );

    setSubmitError("");
  };

  const handleInputChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    clearError(name);
  };

  const handlePhoneChange = (
    event
  ) => {
    const formatted =
      formatPhoneInput(
        event.target.value,
        formData.phoneCountry
      );

    setFormData(
      (current) => ({
        ...current,
        phone: formatted,
      })
    );

    clearError("phone");
  };

  const handleCountryChange = (
    countryCode
  ) => {
    setFormData((current) => {
      const preservedPhone = formatPhoneInput(
        current.phone,
        countryCode
      );

      return {
        ...current,
        phoneCountry: countryCode,
        phone: preservedPhone,
      };
    });

    clearError("phone");
  };

  const handlePaymentMethodChange =
    (method) => {
      setPaymentMethod(method);

      setErrors(
        (current) => ({
          ...current,

          transactionReference:
            "",

          paymentProof: "",
        })
      );

      setSubmitError("");
    };

  const handlePaymentProofChange =
    (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        setPaymentProof(null);
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        setErrors(
          (current) => ({
            ...current,

            paymentProof:
              "Upload JPG, PNG or WEBP only.",
          })
        );

        event.target.value =
          "";

        return;
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        setErrors(
          (current) => ({
            ...current,

            paymentProof:
              "Receipt must be below 5 MB.",
          })
        );

        event.target.value =
          "";

        return;
      }

      setPaymentProof(file);

      clearError(
        "paymentProof"
      );
    };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    if (
      checkoutMutation.isPending
    ) {
      return;
    }

    const validationErrors =
      {};

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      formData.fullName
        .trim()
        .length < 3
    ) {
      validationErrors.fullName =
        "Enter your complete name.";
    }

    if (
      !emailPattern.test(
        formData.email.trim()
      )
    ) {
      validationErrors.email =
        "Enter a valid email address.";
    }

    const phoneValidation =
      validatePhoneNumber(
        formData.phone,
        formData.phoneCountry
      );

    if (!phoneValidation.valid) {
      validationErrors.phone =
        phoneValidation.error;
    }

    if (
      formData.addressLine1
        .trim()
        .length < 5
    ) {
      validationErrors.addressLine1 =
        "Enter your complete delivery address.";
    }

    if (
      formData.city
        .trim()
        .length < 2
    ) {
      validationErrors.city =
        "Enter your city.";
    }

    if (
      formData.state
        .trim()
        .length < 2
    ) {
      validationErrors.state =
        "Enter your state or province.";
    }

    if (
      formData.postalCode
        .trim()
        .length < 3
    ) {
      validationErrors.postalCode =
        "Enter your postal code.";
    }

    if (
      paymentMethod ===
      "bank_transfer"
    ) {
      if (
        formData
          .transactionReference
          .trim()
          .length < 3
      ) {
        validationErrors.transactionReference =
          "Enter your transaction reference.";
      }

      if (!paymentProof) {
        validationErrors.paymentProof =
          "Upload your payment receipt.";
      }
    }

    setErrors(
      validationErrors
    );

    if (
      Object.keys(
        validationErrors
      ).length > 0
    ) {
      setSubmitError(
        "Check the highlighted fields before continuing."
      );

      return;
    }

    if (
      paintingItems.length ===
      0
    ) {
      setSubmitError(
        "Your painting cart is empty."
      );

      return;
    }

    if (hasInvalidItems) {
      setSubmitError(
        "This checkout only supports paintings."
      );

      return;
    }

    if (
      hasUnavailableItems
    ) {
      setSubmitError(
        "One or more paintings are unavailable. Return to cart and update them."
      );

      return;
    }

    setSubmitError("");

    checkoutMutation.mutate();
  };

  /*
  |--------------------------------------------------------------------------
  | Page States
  |--------------------------------------------------------------------------
  */

  if (!cartReady) {
    return (
      <PageLoader text="Preparing Checkout" />
    );
  }

  if (successOrder) {
    return (
      <CheckoutSuccess
        order={
          successOrder
        }
      />
    );
  }

  if (
    paintingItems.length ===
    0
  ) {
    return (
      <CheckoutMessage
        title="Your Cart Is Empty"
        description="Add an original painting before starting checkout."
        buttonText="Explore Paintings"
        href="/shop"
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Checkout UI
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#faf5f1] text-[#4c4038]">
      {/* Checkout Header */}
      <header className="border-b border-[#eadfd6] bg-[#fffdfb]">
        <div className="mx-auto flex max-w-[1220px] items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#83766c] transition hover:text-[#6f5543]"
          >
            <ArrowLeft
              size={14}
            />

            Back to Cart
          </Link>

          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6f5543]">
            <LockKeyhole
              size={14}
            />

            Secure Checkout
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1220px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:px-8 lg:py-14">
        {/* Left Side */}
        <form
          onSubmit={
            handleSubmit
          }
          noValidate
          className="overflow-hidden rounded-[18px] border border-[#eadfd6] bg-[#fffdfb] shadow-[0_18px_55px_rgba(76,64,56,0.06)]"
        >
          {/* Main Heading */}
          <div className="border-b border-[#eadfd6] px-5 py-6 sm:px-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b07f59]">
              Secure checkout
            </p>

            <h1
              className={`font-special mt-2 text-[46px] font-medium italic leading-none text-[#4c4038] sm:text-[54px]`}
            >
              Complete Your Order
            </h1>

            <p className="mt-3 text-[13px] leading-6 text-[#83766c]">
              Enter your contact,
              delivery and payment
              information below.
            </p>
          </div>

          <div className="space-y-8 p-5 sm:p-7">
            {/* Contact */}
            <CheckoutBlock
              title="Contact Information"
              description="Used for your receipt and delivery updates."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleInputChange
                  }
                  icon={
                    <UserRound
                      size={17}
                    />
                  }
                  placeholder="Your complete name"
                  autoComplete="name"
                  error={
                    errors.fullName
                  }
                />

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleInputChange
                  }
                  icon={
                    <Mail size={17} />
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={errors.email}
                />

                <div className="sm:col-span-2">
                  <CountryPhoneField
                    countries={
                      COUNTRY_OPTIONS
                    }
                    country={
                      formData.phoneCountry
                    }
                    phone={
                      formData.phone
                    }
                    onCountryChange={
                      handleCountryChange
                    }
                    onPhoneChange={
                      handlePhoneChange
                    }
                    error={
                      errors.phone
                    }
                  />
                </div>
              </div>
            </CheckoutBlock>

            <SectionDivider />

            {/* Delivery */}
            <CheckoutBlock
              title="Delivery Address"
              description="Your artwork will be delivered to this address."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <InputField
                    label="Street Address"
                    name="addressLine1"
                    value={
                      formData.addressLine1
                    }
                    onChange={
                      handleInputChange
                    }
                    icon={
                      <MapPin
                        size={17}
                      />
                    }
                    placeholder="House, building and street"
                    autoComplete="address-line1"
                    error={
                      errors.addressLine1
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <InputField
                    label="Apartment, Suite or Landmark"
                    name="addressLine2"
                    value={
                      formData.addressLine2
                    }
                    onChange={
                      handleInputChange
                    }
                    icon={
                      <Building2
                        size={17}
                      />
                    }
                    placeholder="Optional"
                    autoComplete="address-line2"
                  />
                </div>

                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={
                    handleInputChange
                  }
                  icon={
                    <Building2
                      size={17}
                    />
                  }
                  placeholder="City"
                  autoComplete="address-level2"
                  error={errors.city}
                />

                <InputField
                  label="State / Province"
                  name="state"
                  value={formData.state}
                  onChange={
                    handleInputChange
                  }
                  icon={
                    <MapPin
                      size={17}
                    />
                  }
                  placeholder="State or province"
                  autoComplete="address-level1"
                  error={errors.state}
                />

                <InputField
                  label="Postal Code"
                  name="postalCode"
                  value={
                    formData.postalCode
                  }
                  onChange={
                    handleInputChange
                  }
                  icon={
                    <MapPin
                      size={17}
                    />
                  }
                  placeholder="Postal code"
                  autoComplete="postal-code"
                  error={
                    errors.postalCode
                  }
                />

                <ReadOnlyField
                  label="Country"
                  countryCode={
                    formData.phoneCountry
                  }
                  value={
                    selectedCountry.name
                  }
                />
              </div>
            </CheckoutBlock>

            <SectionDivider />

            {/* Payment */}
            <CheckoutBlock
              title="Payment"
              description="Choose your preferred payment method."
            >
              <div className="grid grid-cols-2 overflow-hidden rounded-[12px] border border-[#eadfd6] bg-[#faf5f1] p-1">
                <button
                  type="button"
                  onClick={() =>
                    handlePaymentMethodChange(
                      "card"
                    )
                  }
                  className={`flex min-h-[48px] items-center justify-center gap-2 rounded-[9px] px-3 text-[11px] font-semibold transition ${
                    paymentMethod ===
                    "card"
                      ? "bg-[#6d2cff] text-white shadow-[0_8px_24px_rgba(109,44,255,0.28)]"
                      : "text-[#83766c] hover:text-[#6d2cff]"
                  }`}
                >
                  <ZiinaMark compact light={paymentMethod === "card"} />

                  Pay with Ziina
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePaymentMethodChange(
                      "bank_transfer"
                    )
                  }
                  className={`flex min-h-[48px] items-center justify-center gap-2 rounded-[9px] px-3 text-[11px] font-semibold transition ${
                    paymentMethod ===
                    "bank_transfer"
                      ? "bg-[#fffdfb] text-[#4c4038] shadow-[0_4px_16px_rgba(76,64,56,0.1)]"
                      : "text-[#83766c] hover:text-[#6f5543]"
                  }`}
                >
                  <Landmark
                    size={16}
                  />

                  Bank Transfer
                </button>
              </div>

              {paymentMethod === "card" && (
                <div className="relative mt-5 overflow-hidden rounded-[16px] border border-[#d8c8ff] bg-[linear-gradient(135deg,#f8f4ff_0%,#eee5ff_100%)] p-5 shadow-[0_18px_45px_rgba(109,44,255,0.10)]">
                  <div className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full bg-[#6d2cff]/10 blur-2xl" />
                  <div className="relative flex items-start gap-4">
                    <ZiinaMark />
                    <div>
                      <p className="text-sm font-semibold text-[#352b48]">Ziina secure checkout</p>
                      <p className="mt-1 text-xs leading-5 text-[#70657f]">Continue to Ziina to pay by card, Apple Pay, or Google Pay. Card details are handled on Ziina&apos;s protected payment page.</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5d3aa8]">
                        <span className="rounded-full bg-white/80 px-3 py-1.5">Card</span>
                        <span className="rounded-full bg-white/80 px-3 py-1.5">Apple Pay</span>
                        <span className="rounded-full bg-white/80 px-3 py-1.5">Google Pay</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod ===
                "bank_transfer" && (
                <BankTransferFields
                  formData={
                    formData
                  }
                  errors={
                    errors
                  }
                  paymentProof={
                    paymentProof
                  }
                  amount={formatMoney(
                    subtotal,
                    currency
                  )}
                  onInputChange={
                    handleInputChange
                  }
                  onProofChange={
                    handlePaymentProofChange
                  }
                />
              )}
            </CheckoutBlock>

            {hasInvalidItems && (
              <ErrorBanner>
                This checkout only
                supports painting
                products.
              </ErrorBanner>
            )}

            {hasUnavailableItems && (
              <ErrorBanner>
                One or more paintings
                are unavailable or
                exceed available stock.
              </ErrorBanner>
            )}

            {submitError && (
              <ErrorBanner>
                {submitError}
              </ErrorBanner>
            )}

            <button
              type="submit"
              disabled={
                checkoutMutation.isPending ||
                hasInvalidItems ||
                hasUnavailableItems
              }
              className="group inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-[8px] bg-[#6d2cff] px-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_14px_32px_rgba(111,85,67,0.2)] transition hover:-translate-y-0.5 hover:bg-[#5620d4] disabled:cursor-not-allowed disabled:bg-[#d8c9bd] disabled:shadow-none"
            >
              {checkoutMutation.isPending ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />

                  Processing
                </>
              ) : (
                <>
                  {paymentMethod ===
                  "card"
                    ? `Pay with Ziina · ${formatMoney(
                        subtotal,
                        currency
                      )}`
                    : "Submit Painting Order"}

                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-center text-[10px] leading-5 text-[#83766c]">
              <ShieldCheck
                size={14}
                className="text-[#6f5543]"
              />

              Payments are securely processed by Ziina. Card data is never stored by this website.
            </div>
          </div>
        </form>

        {/* Right Summary */}
        <OrderSummary
          items={
            paintingItems
          }
          count={cartCount}
          subtotal={subtotal}
          currency={currency}
          paymentMethod={
            paymentMethod
          }
        />
      </section>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Checkout Block
|--------------------------------------------------------------------------
*/

function ZiinaMark({ compact = false, light = false }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 ${light ? "text-white" : "text-[#6d2cff]"}`}
      aria-label="Ziina"
    >
      <span
        className={`grid place-items-center rounded-[9px] ${
          light ? "bg-white/16 text-white" : "bg-[#6d2cff] text-white"
        } ${compact ? "h-6 w-6" : "h-9 w-9"}`}
      >
        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
          className={compact ? "h-4 w-4" : "h-5 w-5"}
        >
          <path
            d="M8 9.5h16L10.5 22.5H24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact && (
        <span className="text-lg font-extrabold tracking-[-0.045em]">Ziina</span>
      )}
    </span>
  );
}

function CheckoutBlock({
  title,
  description,
  children,
}) {
  return (
    <section>
      <div className="mb-5">
        <h2
          className={`font-special text-[31px] font-medium italic leading-none text-[#4c4038]`}
        >
          {title}
        </h2>

        <p className="mt-2 text-[12px] leading-5 text-[#83766c]">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function SectionDivider() {
  return (
    <div className="h-px bg-[#eadfd6]" />
  );
}

/*
|--------------------------------------------------------------------------
| Input
|--------------------------------------------------------------------------
*/

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  error,
  type = "text",
  autoComplete,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6f5543]">
        {label}
      </span>

      <span
        className={`flex min-h-[54px] items-center gap-3 rounded-[11px] border bg-[#fffdfb] px-4 transition focus-within:ring-4 ${
          error
            ? "border-[#dc8d84] focus-within:ring-[#b85f54]/10"
            : "border-[#eadfd6] focus-within:border-[#6f5543] focus-within:ring-[#6f5543]/10"
        }`}
      >
        <span
          className={
            error
              ? "text-[#b85f54]"
              : "text-[#b07f59]"
          }
        >
          {icon}
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={
            placeholder
          }
          autoComplete={
            autoComplete
          }
          className="min-w-0 flex-1 bg-transparent text-[14px] text-[#4c4038] outline-none placeholder:text-[#83766c]/60"
        />
      </span>

      {error && (
        <span className="mt-1.5 block text-[11px] text-[#b85f54]">
          {error}
        </span>
      )}
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| Country Phone Field
|--------------------------------------------------------------------------
*/

function CountryPhoneField({
  countries,
  country,
  phone,
  onCountryChange,
  onPhoneChange,
  error,
}) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const selectedCountry =
    getCountryOption(country);

  const filteredCountries =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      if (!query) {
        return countries;
      }

      return countries.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(query) ||
          item.code
            .toLowerCase()
            .includes(query) ||
          item.dialCode.includes(
            query
          )
      );
    }, [
      countries,
      search,
    ]);

  return (
    <div className="relative">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6f5543]">
        Phone Number
      </span>

      <div
        className={`flex min-h-[56px] overflow-hidden rounded-[11px] border bg-[#fffdfb] transition focus-within:ring-4 ${
          error
            ? "border-[#dc8d84] focus-within:ring-[#b85f54]/10"
            : "border-[#eadfd6] focus-within:border-[#6f5543] focus-within:ring-[#6f5543]/10"
        }`}
      >
        <button
          type="button"
          onClick={() =>
            setOpen(
              (current) =>
                !current
            )
          }
          className="flex min-w-[128px] shrink-0 items-center gap-2 border-r border-[#eadfd6] bg-[#faf5f1] px-3 transition hover:bg-[#f8efe8]"
        >
          <CountryFlag
            countryCode={
              selectedCountry.code
            }
            countryName={
              selectedCountry.name
            }
          />

          <span className="text-[12px] font-semibold text-[#4c4038]">
            {
              selectedCountry.dialCode
            }
          </span>

          <ChevronDown
            size={14}
            className={`ml-auto text-[#83766c] transition ${
              open
                ? "rotate-180"
                : ""
            }`}
          />
        </button>

        <input
          type="tel"
          value={phone}
          onChange={
            onPhoneChange
          }
          placeholder="Enter phone number"
          inputMode="tel"
          autoComplete="tel-national"
          className="min-w-0 flex-1 bg-transparent px-4 text-[14px] text-[#4c4038] outline-none placeholder:text-[#83766c]/60"
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-[11px] text-[#83766c]">
          {
            selectedCountry.name
          }
        </span>

        {phone && (
          <span className="text-[11px] font-semibold text-[#6f5543]">
            {
              selectedCountry.dialCode
            }{" "}
            {phone}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-1 text-[11px] text-[#b85f54]">
          {error}
        </p>
      )}

      {open && (
        <>
          <button
            type="button"
            aria-label="Close country list"
            onClick={() =>
              setOpen(false)
            }
            className="fixed inset-0 z-30 cursor-default"
          />

          <div className="absolute left-0 top-[82px] z-40 w-full max-w-[430px] overflow-hidden rounded-[14px] border border-[#eadfd6] bg-[#fffdfb] shadow-[0_22px_65px_rgba(76,64,56,0.2)]">
            <div className="relative border-b border-[#eadfd6] p-3">
              <Search
                size={15}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-[#83766c]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search country or code"
                autoFocus
                className="h-11 w-full rounded-[9px] border border-[#eadfd6] bg-[#faf5f1] pl-10 pr-10 text-[13px] text-[#4c4038] outline-none focus:border-[#6f5543]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[#83766c]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="max-h-[310px] overflow-y-auto p-2">
              {filteredCountries.map(
                (item) => (
                  <button
                    key={
                      item.code
                    }
                    type="button"
                    onClick={() => {
                      onCountryChange(
                        item.code
                      );

                      setOpen(false);
                      setSearch("");
                    }}
                    className={`flex w-full items-center gap-3 rounded-[9px] px-3 py-3 text-left transition hover:bg-[#faf5f1] ${
                      country ===
                      item.code
                        ? "bg-[#f8efe8]"
                        : ""
                    }`}
                  >
                    <CountryFlag
                      countryCode={
                        item.code
                      }
                      countryName={
                        item.name
                      }
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-semibold text-[#4c4038]">
                        {item.name}
                      </span>

                      <span className="mt-0.5 block text-[9px] uppercase tracking-[0.1em] text-[#83766c]">
                        {item.code}
                      </span>
                    </span>

                    <span className="text-[12px] font-semibold text-[#6f5543]">
                      {
                        item.dialCode
                      }
                    </span>

                    {country ===
                      item.code && (
                      <Check
                        size={15}
                        className="text-[#b07f59]"
                      />
                    )}
                  </button>
                )
              )}

              {filteredCountries.length ===
                0 && (
                <div className="px-4 py-8 text-center text-[12px] text-[#83766c]">
                  No country found.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CountryFlag({
  countryCode,
  countryName,
}) {
  const FlagComponent =
    flags[countryCode];

  return (
    <span className="flex h-[19px] w-[27px] shrink-0 overflow-hidden rounded-[3px] bg-[#eadfd6] shadow-sm [&>svg]:h-full [&>svg]:w-full">
      {FlagComponent ? (
        <FlagComponent
          title={countryName}
        />
      ) : null}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Read Only Country
|--------------------------------------------------------------------------
*/

function ReadOnlyField({
  label,
  value,
  countryCode,
}) {
  return (
    <div>
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6f5543]">
        {label}
      </span>

      <div className="flex min-h-[54px] items-center gap-3 rounded-[11px] border border-[#eadfd6] bg-[#faf5f1] px-4 text-[14px] text-[#4c4038]">
        <CountryFlag
          countryCode={
            countryCode
          }
          countryName={value}
        />

        <span className="truncate">
          {value}
        </span>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Bank Transfer
|--------------------------------------------------------------------------
*/

function BankTransferFields({
  formData,
  errors,
  paymentProof,
  amount,
  onInputChange,
  onProofChange,
}) {
  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-[13px] border border-[#eadfd6] bg-[#faf5f1] p-5">
        <div className="flex items-center gap-3 border-b border-[#eadfd6] pb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#6f5543] text-white">
            <Landmark
              size={18}
            />
          </span>

          <div>
            <h3 className="text-[12px] font-semibold text-[#4c4038]">
              Bank Details
            </h3>

            <p className="mt-1 text-[10px] text-[#83766c]">
              Transfer the exact order
              amount.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <BankDetailRow
            label="Bank"
            value={
              BANK_DETAILS.bankName
            }
          />

          <BankDetailRow
            label="Account"
            value={
              BANK_DETAILS.accountName
            }
          />

          <BankDetailRow
            label="Account No."
            value={
              BANK_DETAILS.accountNumber
            }
          />

          <BankDetailRow
            label="IBAN"
            value={
              BANK_DETAILS.iban
            }
          />

          <BankDetailRow
            label="Amount"
            value={amount}
            strong
          />
        </div>
      </div>

      <InputField
        label="Transaction Reference"
        name="transactionReference"
        value={
          formData.transactionReference
        }
        onChange={
          onInputChange
        }
        icon={
          <FileText
            size={17}
          />
        }
        placeholder="Bank transaction ID"
        error={
          errors.transactionReference
        }
      />

      <PaymentProofField
        file={paymentProof}
        error={
          errors.paymentProof
        }
        onChange={
          onProofChange
        }
      />
    </div>
  );
}

function PaymentProofField({
  file,
  error,
  onChange,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6f5543]">
        Payment Receipt
      </span>

      <span
        className={`flex min-h-[96px] cursor-pointer items-center gap-4 rounded-[11px] border border-dashed bg-[#faf5f1] px-5 transition hover:bg-[#fffdfb] ${
          error
            ? "border-[#dc8d84]"
            : "border-[#d8c9bd] hover:border-[#6f5543]"
        }`}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#f8efe8] text-[#6f5543]">
          <UploadCloud
            size={20}
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-[#4c4038]">
            {file
              ? file.name
              : "Upload transfer receipt"}
          </span>

          <span className="mt-1 block text-[10px] leading-5 text-[#83766c]">
            JPG, PNG or WEBP ·
            Maximum 5 MB
          </span>
        </span>

        <span className="rounded-[8px] border border-[#eadfd6] bg-[#fffdfb] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#6f5543]">
          Browse
        </span>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onChange}
          className="hidden"
        />
      </span>

      {error && (
        <p className="mt-1.5 text-[11px] text-[#b85f54]">
          {error}
        </p>
      )}
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| Order Summary
|--------------------------------------------------------------------------
*/

function OrderSummary({
  items,
  count,
  subtotal,
  currency,
  paymentMethod,
}) {
  return (
    <aside className="h-fit overflow-hidden rounded-[18px] border border-[#eadfd6] bg-[#fffdfb] shadow-[0_18px_55px_rgba(76,64,56,0.07)] lg:sticky lg:top-6">
      <div className="border-b border-[#eadfd6] bg-[#faf5f1] px-6 py-6">
        <div className="flex items-center justify-between gap-3">
          <h2
            className={`font-special text-[35px] font-medium italic leading-none text-[#4c4038]`}
          >
            Order Summary
          </h2>

          <span className="rounded-full border border-[#eadfd6] bg-[#fffdfb] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6f5543]">
            {count}{" "}
            {count === 1
              ? "item"
              : "items"}
          </span>
        </div>
      </div>

      <div className="max-h-[380px] space-y-5 overflow-y-auto px-6 py-5">
        {items.map((item) => (
          <CheckoutItem
            key={getCartItemId(
              item
            )}
            item={item}
            currency={currency}
          />
        ))}
      </div>

      <div className="border-t border-[#eadfd6] px-6 py-5">
        <div className="space-y-3">
          <SummaryRow
            label="Subtotal"
            value={formatMoney(
              subtotal,
              currency
            )}
          />

          <SummaryRow
            label="Shipping"
            value="Calculated after review"
            small
          />

          <SummaryRow
            label="Discount"
            value={formatMoney(
              0,
              currency
            )}
          />
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#eadfd6] pt-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#83766c]">
              Total
            </p>

            <p className="mt-1 text-[10px] text-[#a89a8f]">
              {currency}
            </p>
          </div>

          <p className="text-[26px] font-bold leading-none text-[#4c4038]">
            {formatMoney(
              subtotal,
              currency
            )}
          </p>
        </div>
      </div>

      <div className="border-t border-[#eadfd6] bg-[#faf5f1] px-6 py-5">
        <div className="space-y-3">
          <SummaryBenefit
            icon={
              <BadgeCheck
                size={15}
              />
            }
            text="Authentic original artwork"
          />

          <SummaryBenefit
            icon={
              <PackageCheck
                size={15}
              />
            }
            text="Protected artwork packaging"
          />

          <SummaryBenefit
            icon={
              <ShieldCheck
                size={15}
              />
            }
            text={
              paymentMethod ===
              "card"
                ? "Secure card checkout"
                : "Manual payment verification"
            }
          />
        </div>
      </div>
    </aside>
  );
}

function CheckoutItem({
  item,
  currency,
}) {
  const quantity = Math.max(
    toSafeNumber(
      item?.quantity,
      1
    ),
    1
  );

  const total =
    getItemPrice(item) *
    quantity;

  const title =
    getItemTitle(item);

  const image =
    getItemImage(item);

  return (
    <div className="grid grid-cols-[74px_minmax(0,1fr)] gap-4">
      <div className="relative overflow-hidden rounded-[11px] bg-[#f8efe8]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-[82px] w-full object-cover"
          />
        ) : (
          <div className="flex h-[82px] items-center justify-center text-[#6f5543]">
            <ImageIcon
              size={22}
              strokeWidth={1.4}
            />
          </div>
        )}

        <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6f5543] px-1 text-[8px] font-bold text-white">
          {quantity}
        </span>
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#b07f59]">
          Original Artwork
        </p>

        <h3 className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-[#4c4038]">
          {title}
        </h3>

        <p className="mt-2 text-[13px] font-semibold text-[#6f5543]">
          {formatMoney(
            total,
            currency
          )}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Small Components
|--------------------------------------------------------------------------
*/

function BankDetailRow({
  label,
  value,
  strong = false,
}) {
  return (
    <div className="grid grid-cols-[105px_minmax(0,1fr)] gap-3 text-[12px]">
      <span className="text-[#83766c]">
        {label}
      </span>

      <span
        className={`break-all text-right ${
          strong
            ? "font-bold text-[#6f5543]"
            : "font-semibold text-[#4c4038]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  small = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-[12px]">
      <span className="text-[#83766c]">
        {label}
      </span>

      <span
        className={`text-right ${
          small
            ? "text-[10px] text-[#83766c]"
            : "font-semibold text-[#4c4038]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SummaryBenefit({
  icon,
  text,
}) {
  return (
    <div className="flex items-center gap-2.5 text-[11px] font-medium text-[#6f5543]">
      <span className="text-[#b07f59]">
        {icon}
      </span>

      {text}
    </div>
  );
}

function ErrorBanner({
  children,
}) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-[11px] border border-[#e6beb8] bg-[#fff4f2] px-4 py-3 text-[12px] leading-6 text-[#94453d]"
    >
      <X
        size={16}
        className="mt-1 shrink-0"
      />

      {children}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Page States
|--------------------------------------------------------------------------
*/

function PageLoader({
  text,
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf5f1] text-[#4c4038]">
      <div className="text-center">
        <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-[#6f5543]" />

        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#83766c]">
          {text}
        </p>
      </div>
    </main>
  );
}

function CheckoutMessage({
  title,
  description,
  buttonText,
  href,
  onClick,
}) {
  const buttonClass =
    "mt-7 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[11px] bg-[#6f5543] px-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#5620d4]";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf5f1] px-4 text-[#4c4038]">
      <div className="w-full max-w-lg rounded-[18px] border border-[#eadfd6] bg-[#fffdfb] p-8 text-center shadow-[0_20px_60px_rgba(76,64,56,0.07)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[14px] bg-[#f8efe8] text-[#6f5543]">
          <ShoppingBag
            size={28}
            strokeWidth={1.4}
          />
        </div>

        <h1
          className={`font-special mt-6 text-[44px] font-medium italic leading-none`}
        >
          {title}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-[13px] leading-7 text-[#83766c]">
          {description}
        </p>

        {href ? (
          <Link
            href={href}
            className={
              buttonClass
            }
          >
            {buttonText}

            <ArrowRight
              size={14}
            />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onClick}
            className={
              buttonClass
            }
          >
            {buttonText}
          </button>
        )}
      </div>
    </main>
  );
}

function CheckoutSuccess({
  order,
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf5f1] px-4 py-16 text-[#4c4038]">
      <div className="w-full max-w-xl rounded-[20px] border border-[#eadfd6] bg-[#fffdfb] p-8 text-center shadow-[0_22px_65px_rgba(76,64,56,0.08)] sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f8efe8] text-[#6f5543]">
          <CheckCircle2
            size={38}
            strokeWidth={1.5}
          />
        </div>

        <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b07f59]">
          Order Submitted
        </p>

        <h1
          className={`font-special mt-3 text-[51px] font-medium italic leading-[0.9]`}
        >
          Thank You
        </h1>

        <p className="mx-auto mt-5 max-w-md text-[13px] leading-7 text-[#83766c]">
          Your order and bank transfer
          receipt have been received.
          Payment verification is
          currently pending.
        </p>

        {order.orderNumber && (
          <div className="mt-6 rounded-[12px] border border-[#eadfd6] bg-[#faf5f1] px-5 py-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#83766c]">
              Order Number
            </p>

            <p className="mt-2 text-[15px] font-bold text-[#4c4038]">
              {order.orderNumber}
            </p>
          </div>
        )}

        <Link
          href="/shop"
          className="mt-7 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[11px] bg-[#6f5543] px-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#5620d4]"
        >
          Continue Shopping

          <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  );
}